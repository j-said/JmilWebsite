// Few writes, many reads: each iteration is 1 order + 9 reads.
// Run with ./loadtest/run.sh, settings in loadtest/README.md.

import http from "k6/http";
import { check, fail, sleep } from "k6";
import exec from "k6/execution";
import { Rate } from "k6/metrics";

const BASE = (__ENV.BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const API = `${BASE}/api/v1`;
const VUS = Number(__ENV.VUS || 40);
const RAMP_UP = __ENV.RAMP_UP || "3m";
const STEADY = __ENV.STEADY || "5m";
const RAMP_DOWN = __ENV.RAMP_DOWN || "2m";
const WRITE_MODE = __ENV.WRITE_MODE || "sync"; // or "async" for POST /orders/async
const USERS = Number(__ENV.USERS || 10);
const THINK = Number(__ENV.THINK || 0.3); // pause between requests, s
const RUN_NAME = __ENV.RUN_NAME || "run";

const cacheHit = new Rate("cache_hit");

export const options = {
  scenarios: {
    shoppers: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: RAMP_UP, target: VUS },
        { duration: STEADY, target: VUS },
        { duration: RAMP_DOWN, target: 0 },
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    // Also gives separate read/write numbers in the summary.
    "http_req_duration{kind:read}": ["p(95)<2000"],
    "http_req_duration{kind:write}": ["p(95)<3000"],
  },
  summaryTrendStats: ["avg", "min", "med", "p(90)", "p(95)", "p(99)", "max"],
  setupTimeout: "5m",
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const json = { "Content-Type": "application/json" };

export function setup() {
  const facets = http.get(`${API}/products/facets`).json();
  const catalog = http.get(`${API}/products?limit=100`).json();
  const inStock = catalog.items.filter((p) => p.inStock).map((p) => p.id);
  const allIds = catalog.items.map((p) => p.id);
  if (!inStock.length) fail("no products in stock: is the database seeded?");

  // Mostly the first page, sometimes a sort or a filter.
  const catalogQueries = [
    "",
    "",
    "",
    "",
    "?page=2",
    "?sort=price",
    "?sort=price-desc",
    "?sort=rating",
    "?sort=newest",
    "?inStock=true",
    ...facets.categories
      .slice(0, 3)
      .map((c) => `?category=${encodeURIComponent(c)}`),
    ...facets.brands.slice(0, 2).map((b) => `?brand=${encodeURIComponent(b)}`),
  ];

  // Login is CPU-heavy (Argon2), so it is done once here, not in the loop.
  const runId = Date.now().toString(36);
  const tokens = [];
  for (let i = 0; i < USERS; i++) {
    const email = `lt-${runId}-${i}@loadtest.jmil.dev`;
    const password = "loadtest-pass-123";
    const reg = http.post(
      `${API}/auth/register`,
      JSON.stringify({
        email,
        password,
        firstName: "Load",
        lastName: `User${i}`,
      }),
      { headers: json },
    );
    if (reg.status !== 201) fail(`register failed: ${reg.status} ${reg.body}`);
    const login = http.post(`${API}/auth/login`, { username: email, password });
    if (login.status !== 200) fail(`login failed: ${login.status}`);
    tokens.push(login.json("access_token"));
  }

  console.log(
    `LOAD_START ${new Date().toISOString()} vus=${VUS} mode=${WRITE_MODE} base=${BASE}`,
  );
  return { tokens, inStock, allIds, catalogQueries };
}

function get(url, name, params = {}) {
  return http.get(url, { ...params, tags: { name, kind: "read" } });
}

function browseCatalog(data) {
  const res = get(
    `${API}/products${pick(data.catalogQueries)}`,
    "GET /products",
  );
  check(res, { "catalog 200": (r) => r.status === 200 });
  cacheHit.add(res.headers["X-Cache"] === "HIT");
}

export default function (data) {
  const token = data.tokens[(exec.vu.idInTest - 1) % data.tokens.length];
  const auth = { headers: { ...json, Authorization: `Bearer ${token}` } };

  // 1 write
  const productId = pick(data.inStock);
  const body = JSON.stringify({
    firstName: "Load",
    lastName: "Test",
    phone: "+380501234567",
    items: [{ productId, quantity: 1 + Math.floor(Math.random() * 2) }],
  });
  let createdUrl;
  if (WRITE_MODE === "async") {
    const res = http.post(`${API}/orders/async`, body, {
      ...auth,
      tags: { name: "POST /orders/async", kind: "write" },
    });
    check(res, { "order accepted 202": (r) => r.status === 202 });
    createdUrl = res.headers["Location"];
  } else {
    const res = http.post(`${API}/orders`, body, {
      ...auth,
      tags: { name: "POST /orders", kind: "write" },
    });
    check(res, { "order created 201": (r) => r.status === 201 });
    createdUrl = res.headers["Location"];
  }
  sleep(THINK);

  // 9 reads
  browseCatalog(data);
  sleep(THINK);

  check(get(`${API}/products/${pick(data.allIds)}`, "GET /products/{id}"), {
    "product 200": (r) => r.status === 200,
  });
  sleep(THINK);

  if (createdUrl) {
    // The new order, or the request status in async mode.
    const name =
      WRITE_MODE === "async" ? "GET /orders/requests/{id}" : "GET /orders/{id}";
    check(get(`${BASE}${createdUrl}`, name, auth), {
      "own order 200": (r) => r.status === 200,
    });
  }
  sleep(THINK);

  check(get(`${API}/products/facets`, "GET /products/facets"), {
    "facets 200": (r) => r.status === 200,
  });
  sleep(THINK);

  browseCatalog(data);
  sleep(THINK);

  check(get(`${API}/users/me`, "GET /users/me", auth), {
    "me 200": (r) => r.status === 200,
  });
  sleep(THINK);

  check(get(`${API}/news`, "GET /news"), {
    "news 200": (r) => r.status === 200,
  });
  sleep(THINK);

  check(get(`${API}/products/${productId}`, "GET /products/{id}"), {
    "ordered product 200": (r) => r.status === 200,
  });
  sleep(THINK);

  browseCatalog(data);
  sleep(THINK);
}

function fmt(ms) {
  return ms === undefined ? "-" : `${ms.toFixed(0)} ms`;
}

export function handleSummary(data) {
  const m = data.metrics;
  const d = m.http_req_duration.values;
  const reqs = m.http_reqs.values;
  const failed = m.http_req_failed.values.rate;
  const read = m["http_req_duration{kind:read}"]?.values || {};
  const write = m["http_req_duration{kind:write}"]?.values || {};
  const hit = m.cache_hit?.values.rate;

  const lines = [
    "",
    `=== ${RUN_NAME}: ${VUS} VUs, ${RAMP_UP} up / ${STEADY} steady / ${RAMP_DOWN} down, writes=${WRITE_MODE} ===`,
    `requests        ${reqs.count}  (${reqs.rate.toFixed(1)} req/s avg)`,
    `iterations      ${m.iterations.values.count}`,
    `errors          ${(failed * 100).toFixed(2)} %`,
    `latency all     p50 ${fmt(d.med)}   p95 ${fmt(d["p(95)"])}   p99 ${fmt(d["p(99)"])}   max ${fmt(d.max)}`,
    `latency reads   p50 ${fmt(read.med)}   p95 ${fmt(read["p(95)"])}   p99 ${fmt(read["p(99)"])}`,
    `latency writes  p50 ${fmt(write.med)}   p95 ${fmt(write["p(95)"])}   p99 ${fmt(write["p(99)"])}`,
    `cache hit rate  ${hit === undefined ? "-" : (hit * 100).toFixed(1) + " %"} (GET /products)`,
    "",
  ];
  return {
    stdout: lines.join("\n"),
    [`results/${RUN_NAME}.json`]: JSON.stringify(data, null, 2),
    [`results/${RUN_NAME}.txt`]: lines.join("\n"),
  };
}

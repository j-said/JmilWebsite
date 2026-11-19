#!/usr/bin/env bash
# Run the load test with one command:
#
#   ./loadtest/run.sh [run-name]
#
# Target defaults to the ALB from Terraform outputs (or http://localhost:8000).
# Uses a local k6 if installed, otherwise the official grafana/k6 Docker image.
# Knobs (env): BASE_URL VUS RAMP_UP STEADY RAMP_DOWN WRITE_MODE USERS THINK
set -euo pipefail

cd "$(dirname "$0")"
NAME="${1:-run-$(date -u +%Y%m%d-%H%M%S)}"
BASE_URL="${BASE_URL:-$(terraform -chdir=../infra output -raw alb_url 2>/dev/null || echo http://localhost:8000)}"
K6_IMAGE="grafana/k6:1.3.0"
mkdir -p results

ARGS=(
    -e "BASE_URL=$BASE_URL" -e "RUN_NAME=$NAME"
    -e "VUS=${VUS:-40}" -e "RAMP_UP=${RAMP_UP:-3m}" -e "STEADY=${STEADY:-5m}" -e "RAMP_DOWN=${RAMP_DOWN:-2m}"
    -e "WRITE_MODE=${WRITE_MODE:-sync}" -e "USERS=${USERS:-10}" -e "THINK=${THINK:-0.3}"
)

echo "[$(date -u +%FT%TZ)] start $NAME -> $BASE_URL" | tee "results/$NAME.log"
if command -v k6 >/dev/null; then
    k6 run "${ARGS[@]}" script.js 2>&1 | tee -a "results/$NAME.log"
else
    docker run --rm -i --network host -u "$(id -u):$(id -g)" \
        -v "$PWD:/work" -w /work "$K6_IMAGE" run "${ARGS[@]}" script.js 2>&1 | tee -a "results/$NAME.log"
fi
echo "[$(date -u +%FT%TZ)] end $NAME" | tee -a "results/$NAME.log"

# JmilDrones

Інтернет-магазин дронів: SPA на React, REST API на FastAPI, PostgreSQL. API розгорнуто в AWS у межах лабораторної роботи №1 з хмарних технологій.

- Адреса: https://d1pdcppbq98g6s.cloudfront.net (актуальна: `terraform -chdir=infra output -raw frontend_url`)
- Swagger: `/docs`

## Стек

| Частина              | Технології                                                                      |
| -------------------- | ------------------------------------------------------------------------------- |
| Frontend (`client/`) | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router v7                 |
| Backend (`api/`)     | FastAPI, SQLAlchemy 2 (async) + asyncpg, Alembic, Pydantic v2, PyJWT, Argon2    |
| БД                   | PostgreSQL 18                                                                   |
| Інфраструктура       | Docker, AWS (ECS Fargate, RDS, ALB, ECR, CloudWatch), Terraform, GitHub Actions |

## Структура

```
.github/workflows/deploy.yml   CI/CD бекенду
.github/workflows/frontend.yml CI/CD фронтенду (S3 + CloudFront)
api/                           FastAPI: app/, alembic/, tests/, Dockerfile, docker-entrypoint.sh
client/                        SPA (S3 + CloudFront)
infra/                         Terraform: network, security, ecr, rds, secrets, ecs, alb,
                               github_oidc, monitoring, frontend; bootstrap/ — бюджет (окремий state)
compose.yaml, .env.example     локальний запуск
```

Бекенд розділено на шари: `api` (HTTP) → `services` (бізнес-логіка) → `models` (SQLAlchemy). Доменні винятки сервісів перетворює на HTTP-відповіді єдиний handler.

## API

| Метод      | Шлях                                                     | Auth | Опис                                     |
| ---------- | -------------------------------------------------------- | ---- | ---------------------------------------- |
| GET        | `/health`, `/health/ready`                               |      | liveness / readiness (з перевіркою БД)   |
| POST       | `/api/v1/auth/register`, `/api/v1/auth/login`            |      | реєстрація / вхід (OAuth2 form) → JWT    |
| GET, PATCH | `/api/v1/users/me`                                       | так  | профіль                                  |
| GET        | `/api/v1/products`, `/products/facets`, `/products/{id}` |      | каталог з пошуком, фільтрами, пагінацією |
| GET, POST  | `/api/v1/orders`, `/orders/{id}`                         | так  | замовлення користувача                   |
| GET        | `/api/v1/news`, `/news/{id}`                             |      | новини                                   |

Без токена захищені ендпоінти повертають `401`. Демо-користувач: `demo@jmil.dev` / `demo12345`.

## Локальний запуск

```bash
cp .env.example .env            # задати DB_PASSWORD і JWT_SECRET
docker compose up -d --build    # API на http://localhost:8000
```

Compose піднімає `postgres:18-alpine` (дані у volume `pgdata`, порт не публікується) і API, який стартує після healthcheck бази. Entrypoint виконує міграції та сід. `docker compose down` зберігає дані, `down -v` видаляє.

Тести: `cd api && pytest && ruff check .` (потрібен запущений Postgres).

Образ: `python:3.12-slim-bookworm`, залежності встановлюються окремим шаром до коду, процес працює від користувача `app` (UID 10001).

## Конфігурація

Через змінні середовища: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (або `DATABASE_URL`), `JWT_SECRET`, `CORS_ORIGINS`, `LOG_LEVEL`, `RUN_MIGRATIONS`, `RUN_SEED`. Повний перелік і значення за замовчуванням: `api/app/core/config.py`.

## AWS

```
Інтернет → CloudFront (HTTPS) → ALB :80 (публічні підмережі, SG: лише CloudFront)
         → ECS Fargate :8000 (публічні підмережі, SG: лише від ALB)
         → RDS PostgreSQL :5432 (приватні підмережі, SG: лише від ECS)
```

- Регіон `eu-central-1`, дві зони доступності.
- ECR: незмінні теги (SHA коміту), сканування при push.
- ECS: 0.25 vCPU / 512 МБ, circuit breaker з автовідкатом.
- RDS `db.t4g.micro`: без публічного доступу, зашифрований диск.
- ALB: health check `/health`.
- Секрети: пароль БД генерує RDS (Secrets Manager), `JWT_SECRET` генерує Terraform (SSM). У task definition лише ARN, значення підставляє ECS при старті.
- `.env`, `*.tfvars`, `*.tfstate` не комітяться.

Поточні ресурси (`terraform -chdir=infra output`):

| Ресурс              | Значення                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Сайт (CloudFront)   | https://d1pdcppbq98g6s.cloudfront.net                                                                                                     |
| CloudFront          | `E2CBL58E4T6219`, домен `d1pdcppbq98g6s.cloudfront.net`                                                                                   |
| S3 фронтенду        | `jmil-frontend-673d53e2c6c20b17be49703342`                                                                                                |
| ECS                 | кластер `jmil-cluster`, сервіс `jmil-api`                                                                                                 |
| Черга SQS           | https://sqs.eu-central-1.amazonaws.com/183364521771/jmil-orders                                                                           |
| Дашборд             | [jmil-dashboard](https://eu-central-1.console.aws.amazon.com/cloudwatch/home?region=eu-central-1#dashboards/dashboard/jmil-dashboard)     |

Перше розгортання:

```bash
export AWS_PROFILE=<профіль>
cp infra/terraform.tfvars.example infra/terraform.tfvars    # alert_email
terraform -chdir=infra init
terraform -chdir=infra apply -target=aws_ecr_repository.api -var="image_tag=bootstrap"

TAG=$(git rev-parse HEAD)
REPO=$(terraform -chdir=infra output -raw ecr_repository_url)
aws ecr get-login-password | docker login --username AWS --password-stdin "${REPO%%/*}"
docker build --platform linux/amd64 -t "$REPO:$TAG" api && docker push "$REPO:$TAG"

terraform -chdir=infra apply -var="image_tag=$TAG"
```

Видалення: `terraform -chdir=infra destroy -var="image_tag=x"` (дані RDS і образи ECR видаляються).

## CI/CD

На push у `master`: ruff + pytest → OIDC-вхід в AWS → збірка й push образу з тегом SHA → нова ревізія task definition → оновлення сервісу ECS з очікуванням health check. AWS-ключі в GitHub не зберігаються; потрібна лише змінна `AWS_ROLE_ARN`:

```bash
gh variable set AWS_ROLE_ARN --body "$(terraform -chdir=infra output -raw github_deploy_role_arn)"
```

### Фронтенд

CloudFront — єдина публічна точка входу: `/api/*` іде на ALB (без кешу), решта — статика з приватного S3 (OAC). SPA і API на одному origin, тож клієнт лишається з відносним `/api/v1`, CORS не потрібен. Шляхи без розширення CloudFront Function переписує на `/index.html`.

На push у `master` зі змінами в `client/`: lint → build → `s3 sync` (`assets/*` — `immutable` на рік, `index.html` — `no-cache`) → інвалідація `/index.html` → видалення бандлів, старших за 7 днів. Поки змінні не задані, job пропускається. Потрібні ще дві змінні:

```bash
gh variable set FRONTEND_BUCKET --body "$(terraform -chdir=infra output -raw frontend_bucket)"
gh variable set CLOUDFRONT_DISTRIBUTION_ID --body "$(terraform -chdir=infra output -raw cloudfront_distribution_id)"
```

TLS: без домену сайт працює на `https://<id>.cloudfront.net` із сертифікатом CloudFront. Для свого домену задайте `domain_name` — Terraform випустить ACM-сертифікат у `us-east-1` (вимога CloudFront) з DNS-валідацією:

- з `route53_zone_id` валідаційні записи й alias A/AAAA створюються автоматично;
- без нього `terraform apply` чекає на сертифікат — додайте CNAME з output `acm_validation_records` у свого DNS-провайдера, а після apply — CNAME домену на `cloudfront_domain` (для apex-домену потрібен ALIAS/ANAME).

ALB відкритий лише для CloudFront (managed prefix list); для прямого доступу — `alb_cloudfront_only = false`. k6 за замовчуванням б'є у `frontend_url`. Регіон для workflows можна змінити змінною `AWS_REGION` (за замовчуванням `eu-central-1`).

## Моніторинг

CloudWatch Logs (`/ecs/jmil-api`), дашборд `jmil-dashboard` (запити, 5xx, затримка, CPU/пам'ять), алерти на email: 5xx від застосунку та відсутність здорових задач. Бюджет 10 USD/міс.

## Лабораторна робота №1

| Завдання             | Реалізація                            |
| -------------------- | ------------------------------------- |
| 1. Контейнер         | `api/Dockerfile`, `compose.yaml`      |
| 2. Terraform         | `infra/`: ECR, RDS, ECS               |
| 3. Мережева ізоляція | RDS у приватних підмережах, SG від SG |
| 4. Load balancer     | ALB, health check `/health`           |
| 5. CD                | GitHub Actions + OIDC                 |
| 6*. Безпека доступу  | JWT, `401` без токена                 |
| 7*. Моніторинг       | логи, дашборд, алерти                 |
| 8*. Документація API | `/docs`                               |

Автор: J-Said

# JmilDrones

Інтернет-магазин дронів: SPA на React, REST API на FastAPI, PostgreSQL. API розгорнуто в AWS у межах лабораторної роботи №1 з хмарних технологій.

- Адреса: http://jmil-alb-388472145.eu-central-1.elb.amazonaws.com (актуальна: `terraform -chdir=infra output -raw alb_url`)
- Swagger: `/docs`

## Стек

| Частина | Технології |
|---|---|
| Frontend (`client/`) | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router v7 |
| Backend (`api/`) | FastAPI, SQLAlchemy 2 (async) + asyncpg, Alembic, Pydantic v2, PyJWT, Argon2 |
| БД | PostgreSQL 18 |
| Інфраструктура | Docker, AWS (ECS Fargate, RDS, ALB, ECR, CloudWatch), Terraform, GitHub Actions |

## Структура

```
.github/workflows/deploy.yml   CI/CD
api/                           FastAPI: app/, alembic/, tests/, Dockerfile, docker-entrypoint.sh
client/                        SPA (у хмару не розгортається)
infra/                         Terraform: network, security, ecr, rds, secrets, ecs, alb,
                               github_oidc, monitoring; bootstrap/ — бюджет (окремий state)
compose.yaml, .env.example     локальний запуск
```

Бекенд розділено на шари: `api` (HTTP) → `services` (бізнес-логіка) → `models` (SQLAlchemy). Доменні винятки сервісів перетворює на HTTP-відповіді єдиний handler.

## API

| Метод | Шлях | Auth | Опис |
|---|---|---|---|
| GET | `/health`, `/health/ready` | | liveness / readiness (з перевіркою БД) |
| POST | `/api/v1/auth/register`, `/api/v1/auth/login` | | реєстрація / вхід (OAuth2 form) → JWT |
| GET, PATCH | `/api/v1/users/me` | так | профіль |
| GET | `/api/v1/products`, `/products/facets`, `/products/{id}` | | каталог з пошуком, фільтрами, пагінацією |
| GET, POST | `/api/v1/orders`, `/orders/{id}` | так | замовлення користувача |
| GET | `/api/v1/news`, `/news/{id}` | | новини |

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
Інтернет → ALB :80 (публічні підмережі)
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

## Моніторинг

CloudWatch Logs (`/ecs/jmil-api`), дашборд `jmil-dashboard` (запити, 5xx, затримка, CPU/пам'ять), алерти на email: 5xx від застосунку та відсутність здорових задач. Бюджет 10 USD/міс.

## Лабораторна робота №1

| Завдання | Реалізація |
|---|---|
| 1. Контейнер | `api/Dockerfile`, `compose.yaml` |
| 2. Terraform | `infra/`: ECR, RDS, ECS |
| 3. Мережева ізоляція | RDS у приватних підмережах, SG від SG |
| 4. Load balancer | ALB, health check `/health` |
| 5. CD | GitHub Actions + OIDC |
| 6*. Безпека доступу | JWT, `401` без токена |
| 7*. Моніторинг | логи, дашборд, алерти |
| 8*. Документація API | `/docs` |

Автор: J-Said

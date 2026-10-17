# 🚁 JmilDrones

Інтернет-магазин дронів: SPA на React + REST API на FastAPI + PostgreSQL.

Функціонал: реєстрація та вхід (JWT), каталог із пошуком, фільтрами, сортуванням і пагінацією, кошик, оформлення замовлення (лише для авторизованих), історія замовлень у профілі, новини.

## Стек

| Частина | Технології |
|---|---|
| Frontend (`client/`) | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router v7, Formik + Yup, Axios |
| Backend (`api/`) | FastAPI, SQLAlchemy 2 (async) + asyncpg, Alembic, Pydantic v2, PyJWT, pwdlib (Argon2) |
| БД | PostgreSQL 17 |
| Тести | pytest + httpx (інтеграційні, на реальному Postgres) |

## Структура бекенду

```
api/
├── app/
│   ├── main.py            # create_app(): middleware, CORS, роутери, lifespan
│   ├── core/              # config (env), database (engine/session), security (JWT, хеші),
│   │                      # exceptions (доменні помилки → HTTP), logging
│   ├── models/            # ORM-моделі: User, Product, Order, OrderItem, NewsPost
│   ├── schemas/           # Pydantic DTO (JSON у camelCase), Page[T], query-моделі
│   ├── services/          # бізнес-логіка; нічого не знає про HTTP
│   ├── api/
│   │   ├── deps.py        # SessionDep, CurrentUser, PageDep (Annotated-залежності)
│   │   ├── health.py      # /health, /health/ready
│   │   └── v1/            # auth, users, products, orders, news
│   ├── seed.py            # ідемпотентне заповнення демо-даними
│   └── seed_data.json
├── alembic/               # міграції схеми
├── tests/
├── requirements.txt       # runtime-залежності
└── requirements-dev.txt   # + тести та ruff
```

Шари: **api** (HTTP: валідація, статус-коди, залежності) → **services** (правила: ціни беруться з БД, чуже замовлення = 404, …) → **models** (SQLAlchemy). Сервіси кидають `NotFoundError` / `ConflictError` / `ValidationError` / `AuthenticationError`, а єдиний exception handler перетворює їх на відповідь.

## API

Повна інтерактивна документація: `http://localhost:8000/docs` (Swagger, кнопка **Authorize** працює з логіном нижче).

| Метод | Шлях | Auth | Опис |
|---|---|---|---|
| GET | `/health` | | liveness (для health check балансувальника) |
| GET | `/health/ready` | | readiness: перевіряє з'єднання з БД |
| POST | `/api/v1/auth/register` | | реєстрація (JSON) → 201 |
| POST | `/api/v1/auth/login` | | OAuth2 password flow (form: `username`=email, `password`) → JWT |
| GET / PATCH | `/api/v1/users/me` | ✅ | профіль / оновлення імені й телефону |
| GET | `/api/v1/products` | | каталог: `page`, `limit`, `search`, `sort`, `category`, `brand`, `feature` (повторювані), `minPrice`, `maxPrice`, `inStock` |
| GET | `/api/v1/products/facets` | | значення для фільтрів |
| GET | `/api/v1/products/{id}` | | товар |
| POST | `/api/v1/orders` | ✅ | створити замовлення: `{firstName, lastName, phone, notes, items: [{productId, quantity}]}` |
| GET | `/api/v1/orders` | ✅ | мої замовлення (пагінація) |
| GET | `/api/v1/orders/{id}` | ✅ | моє замовлення |
| GET | `/api/v1/news`, `/api/v1/news/{id}` | | новини |

Списки повертають `{items, total, page, limit, pages}`. Без токена захищені ендпоінти відповідають `401`.

## Запуск локально

### 1. PostgreSQL

```bash
docker run -d --name jmil-pg -e POSTGRES_USER=jmil -e POSTGRES_PASSWORD=jmil -e POSTGRES_DB=jmil -p 5432:5432 postgres:17-alpine
```

### 2. Backend

```bash
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env          # за потреби поправте DB_* і JWT_SECRET
alembic upgrade head          # створити схему
python -m app.seed            # демо-дані + користувач demo@jmil.dev / demo12345
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev                   # http://localhost:5173
```

Vite проксіює `/api` на `http://localhost:8000`, тому в dev CORS не потрібен. Для іншої адреси API: `VITE_API_URL=https://api.example.com/api/v1 npm run build`.

### Тести та лінтер

```bash
cd api
pytest            # потрібен запущений Postgres; тести самі створять БД <DB_NAME>_test
ruff check . && ruff format --check .
```

```bash
cd client
npm run lint && npm run build
```

## Конфігурація (змінні середовища)

| Змінна | За замовчуванням | Призначення |
|---|---|---|
| `DATABASE_URL` | — | повний URL (`postgresql+asyncpg://…`); якщо не задано — збирається з `DB_*` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | `localhost`, `5432`, `jmil`, `jmil`, `jmil` | частини підключення (пароль екранується коректно) |
| `DB_POOL_SIZE`, `DB_MAX_OVERFLOW` | `5`, `5` | розмір пулу на один екземпляр застосунку |
| `JWT_SECRET` | dev-значення | **обов'язково змінити** в хмарі (`openssl rand -hex 32`) |
| `JWT_EXPIRE_MINUTES` | `1440` | час життя токена |
| `CORS_ORIGINS` | `http://localhost:5173` | дозволені origin через кому |
| `LOG_LEVEL` | `INFO` | логи йдуть у stdout одним рядком на запит |

## Нотатки для хмарного розгортання

- Застосунок stateless (JWT, без сесій у пам'яті) — його можна масштабувати горизонтально.
- Міграції (`alembic upgrade head`) і сід (`python -m app.seed`) — окремі команди; їх зручно запускати перед стартом сервісу або окремою задачею.
- `SIGTERM` обробляється коректно: uvicorn дочікується поточних запитів, `lifespan` закриває пул з'єднань.
- Типовий сценарій навантаження «один запис — багато читань» уже покривається API: `POST /orders` + `GET /products`, `GET /products/{id}`, `GET /orders/{id}`, `GET /users/me`.

#Developed by J-Said

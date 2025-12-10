# 🚁 JmilDrones

JmilDrones — це сучасний Full-Stack E-commerce застосунок для продажу дронів та комплектуючих. Проєкт реалізовано як SPA (Single Page Application) з використанням React 19 та високопродуктивного асинхронного бекенду на FastAPI (Python).

## 🛠️ Технологічний Стек

### Frontend (/client)

- **Core:** React 19, Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit (Cart & Wishlist persistence)
- **Routing:** React Router v7
- **Forms:** Formik + Yup validation
- **HTTP Client:** Axios

### Backend (/api)

- **Framework:** FastAPI
- **Server:** Uvicorn (ASGI)
- **Database ORM:** SQLAlchemy (Async)
- **Validation:** Pydantic v2
- **DB Driver:** asyncpg (PostgreSQL)
- **Testing:** Pytest

### Database

- **System:** PostgreSQL

## 📂 Структура Проєкту

Проєкт розділено на дві основні частини:

### 1. Backend Structure (/api)

Використовується "Flat Layout" для простоти та швидкості розробки мікросервісу.

```
api/
├── config.py      # Налаштування (Pydantic Settings). Читає змінні з .env.
├── database.py    # Ініціалізація підключення до БД та опис ORM моделей (Tables).
├── schemas.py     # Pydantic моделі (DTO) для валідації вхідних/вихідних даних.
├── crud.py        # Вся бізнес-логіка та SQL-запити до бази даних.
├── main.py        # Точка входу. Визначення FastAPI app, CORS та маршрутів (Routes).
├── req.txt        # Список Python-залежностей.
└── tests/         # Тести (Pytest) та SQL скрипти для ініціалізації.
```

**Особливості реалізації:**

- **Асинхронність:** Всі запити до БД виконуються асинхронно (await db.execute).
- **Type Safety:** Сувора типізація даних на вході та виході завдяки Pydantic.
- **Dependency Injection:** Сесія бази даних передається в роути через Depends(get_db).

### 2. Frontend Structure (/client)

```
client/src/
├── api/           # Налаштування Axios інстансу.
├── assets/        # Статичні файли (SVG, images).
├── components/    # Перевикористовувані компоненти UI.
│   ├── header/    # Навігація, теми, мобільне меню.
│   ├── market/    # Компоненти магазину (картки, фільтри, кошик).
│   │   ├── filters/ # Логіка фільтрації (Desktop & Mobile).
│   │   ├── products/# Відображення товарів.
│   │   └── checkout/# Форми оформлення замовлення.
│   └── ui/        # Загальні UI елементи (Loader, Pagination, etc.).
├── constants/     # Константи (наприклад, опції сортування).
├── data/          # Мокові дані (для розробки).
├── hooks/         # Кастомні хуки (useCart, useWishlist).
├── pages/         # Сторінки (HomePage, MarketPage, CheckoutPage тощо).
├── redux/         # Слайси Redux (cart, wishlist) та store.
└── services/      # API сервіси для комунікації з бекендом.
```

## 🚀 Встановлення та Запуск

### Крок 1: Налаштування Бази Даних (PostgreSQL)

1. Встановіть PostgreSQL.
2. Створіть базу даних та користувача.
3. Виконайте SQL скрипти для створення таблиць:
    - Знайдіть файл `api/tests/create-db.sql` (або `api/create-db.sql`).
    - Запустіть його вміст у вашій базі даних.
    - Якщо є файл `update-db.sql` (для таблиці замовлень), виконайте його також.

### Крок 2: Запуск Бекенду

Перейдіть у папку api:

```bash
cd api
```

Створіть файл `.env` на основі прикладу:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spa_bd
LOG_LEVEL=INFO
```

Створіть віртуальне оточення та встановіть залежності:

```bash
python3 -m venv .venv
source .venv/bin/activate  # Для Windows: .venv\Scripts\activate
pip install -r req.txt
```

Запустіть сервер:

```bash
uvicorn main:app --reload --port 3001
```

- **API:** http://localhost:3001
- **Документація (Swagger):** http://localhost:3001/docs

### Крок 3: Запуск Фронтенду

Відкрийте новий термінал та перейдіть у папку client:

```bash
cd client
```

Встановіть залежності:

```bash
npm install
```

Запустіть режим розробки:

```bash
npm run dev
```

Клієнт буде доступний за адресою: http://localhost:5173

## ✨ Основний Функціонал

### Каталог Товарів

- Пагінація, пошук та сортування.
- Динамічні фільтри (Ціна, Бренд, Категорія, Характеристики).
- Синхронізація стану фільтрів з URL (можна ділитися посиланням).

### Адаптивність

- Повноцінна мобільна версія з нижньою панеллю фільтрів (Bottom Sheet).
- Бургер-меню та адаптивний хедер.

### Кошик та Checkout

- Збереження кошика в LocalStorage.
- Валідація форми замовлення (Formik + Yup).
- Відправка замовлення на сервер.

### Темна Тема

- Підтримка системних налаштувань та ручне перемикання.

## 🧪 Тестування (Backend)

Проєкт використовує pytest для тестування API.

1. Створіть тестову базу даних `test_db` у Postgres.
2. Запустіть тести з папки api:

```bash
pytest -v
```

#Developed by J-Said
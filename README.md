# Застосунок для керування завданнями (TODO)

Цей проєкт — повноцінний Full-Stack застосунок для керування завданнями, що складається з клієнтської частини (Next.js) та серверної частини (Express.js).

## Технологічний стек

**Frontend:**
- [Next.js](https://nextjs.org/) (App Router)
- React
- [@tanstack/react-query](https://tanstack.com/query/latest) (для оптимістичних оновлень та роботи з API)
- TypeScript

**Backend:**
- [Express.js](https://expressjs.com/) v5
- [Sequelize](https://sequelize.org/) ORM
- PostgreSQL (підтримується також SQLite)
- JWT (аутентифікація через `HttpOnly` cookie)
- Zod (валідація запитів)

## Структура проєкту

- `/frontend` — Клієнтський застосунок.
- `/backend` — API сервер.

---

## 🚀 Як запустити локально

### 1. Підготовка бази даних (PostgreSQL)
Переконайтеся, що у вас встановлено PostgreSQL і він працює. Створіть базу даних для проєкту.

### 2. Запуск бекенду
```bash
cd backend
npm install
```

Створіть файл `.env` у папці `backend/` за зразком `.env.example`:
```env
PORT=3001
DB_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```
*(Якщо хочете використовувати SQLite замість PostgreSQL для швидкого тестування, замініть `DB_URL` на `sqlite://todo.sqlite`)*

Запустіть сервер (він також автоматично створить таблиці у базі даних):
```bash
npm run dev
```

### 3. Запуск фронтенду
Відкрийте новий термінал.
```bash
cd frontend
npm install
```

Створіть файл `.env.local` у папці `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Запустіть клієнт:
```bash
npm run dev
```

Відкрийте браузер за адресою [http://localhost:3000](http://localhost:3000).

---

## 🔥 Особливості реалізації
- **Безпека:** Токени доступу зберігаються виключно в `HttpOnly`, `SameSite=lax` куках. Впроваджено `helmet` та `express-rate-limit`.
- **Оптимістичні оновлення UI:** На фронтенді використано React Query, тому при зміні статусу завдання чи видаленні інтерфейс реагує миттєво, не чекаючи відповіді від сервера.
- **Підтримка тем:** Автоматично визначає тему операційної системи (Темна/Світла) з можливістю ручного перемикання.

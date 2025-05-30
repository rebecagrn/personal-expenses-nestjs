# Personal Expenses API

A RESTful API built with NestJS, Prisma, and PostgreSQL for managing personal expenses.

## Features

- CRUD operations for expenses
- Filter expenses by month, year, and category
- Caching of expense queries with Redis
- Swagger documentation
- Input validation
- PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd personal-expenses-nestjs
```

2. Install dependencies:

```bash
npm install
```

3. Create a PostgreSQL database and update the `.env` file with your database connection string:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/personal_expenses?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

5. **Start Redis** (required for caching):

- **macOS (Homebrew):**
  ```bash
  brew services start redis
  # To stop: brew services stop redis
  ```
- **Linux:**
  ```bash
  sudo service redis-server start
  # To stop: sudo service redis-server stop
  ```
- **Manual:**
  ```bash
  redis-server
  # Stop with Ctrl+C in the terminal
  ```
- **Docker:**
  ```bash
  docker run --name redis -p 6379:6379 -d redis
  # To stop: docker stop redis
  ```

6. **Check if Redis is running:**

```bash
redis-cli ping
# Should return: PONG
```

## Running the application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## API Endpoints

- `POST /expenses` - Create a new expense
- `GET /expenses` - Get all expenses (with optional month/year/category filters, e.g. `/expenses?month=5&year=2025&category=Food`)
- `GET /expenses/:id` - Get a specific expense
- `PATCH /expenses/:id` - Update an expense
- `DELETE /expenses/:id` - Delete an expense

## Example Request

Create a new expense:

```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Groceries",
    "amount": 150.50,
    "category": "Food",
    "date": "2024-03-15"
  }'
```

Get expenses filtered by month, year, and category (with Redis cache):

```bash
curl "http://localhost:3000/expenses?month=5&year=2025&category=Food"
```

## Caching

- The first request for a given filter will fetch from the database and cache the result in Redis for 60 seconds.
- Subsequent requests with the same filters will be served from Redis cache (faster).
- If you create, update, or delete an expense, you may want to clear the cache for up-to-date results (not automated in this version).

## License

MIT

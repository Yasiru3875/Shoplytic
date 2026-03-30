# User Service — ShopStream API

Handles user registration, login, and profile management.

## Prerequisites
- Node.js v18+
- MongoDB running on localhost:27017

## Setup

```bash
npm install
npm start
```

## URLs
- Service:  http://localhost:3001
- Swagger:  http://localhost:3001/api-docs

## Endpoints

| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | /users/register    | Register new user  |
| POST   | /users/login       | Login              |
| GET    | /users             | Get all users      |
| GET    | /users/:id         | Get user by ID     |
| DELETE | /users/:id         | Delete user        |

## Sample request — Register

```bash
curl -X POST http://localhost:3001/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Pradeep Silva","email":"pradeep@example.com","password":"secret123"}'
```

## Sample request — Login

```bash
curl -X POST http://localhost:3001/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pradeep@example.com","password":"secret123"}'
```

## Via API Gateway (port 3000)

```
POST http://localhost:3000/api/users/register
POST http://localhost:3000/api/users/login
GET  http://localhost:3000/api/users
GET  http://localhost:3000/api/users/:id
```

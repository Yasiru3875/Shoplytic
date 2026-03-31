# API Gateway — ShopStream API

Single entry point for all microservices. Routes every request to the correct
service so the client never needs to know individual ports.

## Prerequisites
- Node.js v18+
- All 5 microservices must be running before testing via gateway

## Setup

```bash
npm install
npm start
```

Expected output:
```
✅  API Gateway running on http://localhost:3000
📖  Swagger UI       → http://localhost:3000/api-docs
```

## Routing table

| Gateway URL                          | Forwards to                   |
|--------------------------------------|-------------------------------|
| http://localhost:3000/api/users/**   | http://localhost:3001/users/  |
| http://localhost:3000/api/products/**| http://localhost:3002/products|
| http://localhost:3000/api/orders/**  | http://localhost:3003/orders/ |
| http://localhost:3000/api/payments/**| http://localhost:3004/payments|
| http://localhost:3000/api/notifications/** | http://localhost:3005/notifications |

## Start order (6 terminals)

```bash
# Terminal 1 — Gateway (start this last)
cd api-gateway && npm start

# Terminal 2
cd user-service && npm start

# Terminal 3
cd product-service && npm start

# Terminal 4
cd order-service && npm start

# Terminal 5
cd payment-service && npm start

# Terminal 6
cd notification-service && npm start
```

## Test via gateway

```bash
# Register a user through the gateway
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Pradeep Silva","email":"pradeep@example.com","password":"secret123"}'

# Get all products through the gateway
curl http://localhost:3000/api/products
```

## Swagger UI (all services in one doc)
http://localhost:3000/api-docs

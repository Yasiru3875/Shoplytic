const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Service URLs ──────────────────────────────────────────────────────────────
const SERVICES = {
  users:         'http://localhost:3001',
  products:      'http://localhost:3002',
  orders:        'http://localhost:3003',
  payments:      'http://localhost:3004',
  notifications: 'http://localhost:3005',
};

// ── Proxy Routes ──────────────────────────────────────────────────────────────
// Each route strips the /api prefix and forwards to the correct service.
// Example: GET /api/users/123  →  GET http://localhost:3001/users/123

Object.entries(SERVICES).forEach(([name, target]) => {
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/api/${name}`]: `/${name}` },
    onProxyReq: fixRequestBody,
  });

  // Handle downstream service being unavailable
  app.use(`/api/${name}`, (req, res, next) => {
    proxy(req, res, (err) => {
      if (err) {
        console.error(`[Gateway] Proxy error for /${name}:`, err.message);
        return res.status(502).json({
          error: 'Bad Gateway',
          message: `${name} service is unavailable. Make sure it is running on ${target}`,
        });
      }
      next(err);
    });
  });
});

// ── Swagger UI (aggregated) ───────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Gateway',
      version: '1.0.0',
      description:
        'Unified API documentation. All endpoints accessible through the gateway on port 3000.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'API Gateway' },
      { url: 'http://localhost:3001', description: 'User-Service' },
      { url: 'http://localhost:3002', description: 'Product-Service' },
      { url: 'http://localhost:3003', description: 'Order-Service' },
      { url: 'http://localhost:3004', description: 'Payment-Service' },
      { url: 'http://localhost:3005', description: 'Notification-Service' },
    ],
    tags: [
      { name: 'Users',         description: 'User management (→ port 3001)' },
      { name: 'Products',      description: 'Product catalog (→ port 3002)' },
      { name: 'Orders',        description: 'Order management (→ port 3003)' },
      { name: 'Payments',      description: 'Payment processing (→ port 3004)' },
      { name: 'Notifications', description: 'Notifications (→ port 3005)' },
    ],
    paths: {
      '/api/users/register': {
        post: { tags: ['Users'], summary: 'Register a user',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
          responses: { 201: { description: 'User created' } } }
      },
      '/api/users/login': {
        post: { tags: ['Users'], summary: 'Login',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
          responses: { 200: { description: 'Login successful' } } }
      },
      '/api/users': {
        get: { tags: ['Users'], summary: 'Get all users',
          responses: { 200: { description: 'List of all users' } } }
      },
      '/api/users/{id}': {
        get: { tags: ['Users'], summary: 'Get user by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User found' } } },
        delete: { tags: ['Users'], summary: 'Delete user by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User deleted' } } }
      },
      
      '/api/products': {
        get:  { tags: ['Products'], summary: 'Get all products', responses: { 200: { description: 'List of products' } } },
        post: { tags: ['Products'], summary: 'Create product',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } },
          responses: { 201: { description: 'Product created' } } }
      },
      '/api/products/{id}': {
        get: { tags: ['Products'], summary: 'Get product by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product found' } } },
        put: { tags: ['Products'], summary: 'Update product',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } },
          responses: { 200: { description: 'Product updated' } } },
        delete: { tags: ['Products'], summary: 'Delete product',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Product deleted' } } }
      },
      '/api/orders': {
        get:  { tags: ['Orders'], summary: 'Get all orders', responses: { 200: { description: 'List of all orders' } } },
        post: { tags: ['Orders'], summary: 'Create order',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderInput' } } } },
          responses: { 201: { description: 'Order created' } } }
      },
      '/api/orders/{id}': {
        get: { tags: ['Orders'], summary: 'Get order by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Order found' } } }
      },
      '/api/orders/{id}/status': {
        put: { tags: ['Orders'], summary: 'Update order status',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] } } } } } },
          responses: { 200: { description: 'Status updated' } } }
      },
      '/api/orders/user/{userId}': {
        get: { tags: ['Orders'], summary: 'Get orders by user',
          parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Orders list' } } }
      },
      '/api/payments': {
        get: { tags: ['Payments'], summary: 'Get all payments', responses: { 200: { description: 'List of all payments' } } },
        post: { tags: ['Payments'], summary: 'Process payment',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PaymentInput' } } } },
          responses: { 201: { description: 'Payment processed' } } }
      },
      '/api/payments/{orderId}': {
        get: { tags: ['Payments'], summary: 'Get payment by order ID',
          parameters: [{ in: 'path', name: 'orderId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Payment found' } } }
      },
      '/api/payments/{id}/refund': {
        put: { tags: ['Payments'], summary: 'Refund a payment',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Payment refunded' } } }
      },
      '/api/notifications': {
        post: { tags: ['Notifications'], summary: 'Send notification',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/NotificationInput' } } } },
          responses: { 201: { description: 'Notification sent' } } }
      },
      '/api/notifications/user/{userId}': {
        get: { tags: ['Notifications'], summary: 'Get notifications for user',
          parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Notifications list' } } }
      },
    },
    components: {
      schemas: {
        RegisterInput: {
          type: 'object', required: ['name','email','password'],
          properties: { name: { type: 'string', example: 'Pradeep Silva' }, email: { type: 'string', example: 'pradeep@example.com' }, password: { type: 'string', example: 'secret123' } }
        },
        LoginInput: {
          type: 'object', required: ['email','password'],
          properties: { email: { type: 'string', example: 'pradeep@example.com' }, password: { type: 'string', example: 'secret123' } }
        },
        ProductInput: {
          type: 'object', required: ['name','price','stock'],
          properties: { name: { type: 'string', example: 'Laptop' }, price: { type: 'number', example: 150000 }, stock: { type: 'integer', example: 20 }, category: { type: 'string', example: 'Electronics' } }
        },
        OrderInput: {
          type: 'object', required: ['userId','items'],
          properties: { userId: { type: 'string', example: '64abc...' }, items: { type: 'array', items: { type: 'object', properties: { productId: { type: 'string' }, quantity: { type: 'integer', example: 2 } } } } }
        },
        PaymentInput: {
          type: 'object', required: ['orderId','amount','method'],
          properties: { orderId: { type: 'string', example: '64abc...' }, amount: { type: 'number', example: 300000 }, method: { type: 'string', enum: ['card','cash','online'], example: 'card' } }
        },
        NotificationInput: {
          type: 'object', required: ['userId','message','type'],
          properties: { userId: { type: 'string', example: '64abc...' }, message: { type: 'string', example: 'Your order has been placed.' }, type: { type: 'string', enum: ['email','sms','push'], example: 'email' } }
        },
      }
    }
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'E-Commerce API Gateway is running',
    port: PORT,
    routes: Object.keys(SERVICES).map(name => ({
      gateway: `http://localhost:${PORT}/api/${name}`,
      service: SERVICES[name],
    })),
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

app.listen(PORT, () => {
  console.log(`\n✅  API Gateway running on http://localhost:${PORT}`);
  console.log(`📖  Swagger UI       → http://localhost:${PORT}/api-docs\n`);
});

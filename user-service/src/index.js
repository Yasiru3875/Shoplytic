const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3001;
const MONGO_URI = 'mongodb+srv://samarakoonsarith:sariya123@cluster0.mqo6ik9.mongodb.net/Shoplytic_db?appName=Cluster0';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Swagger ───────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'User Service API', version: '1.0.0', description: 'Manages user registration, login, and profiles.' },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Direct (native)' },
      { url: 'http://localhost:3000',    description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/users', userRoutes);

app.get('/', (req, res) => res.json({ service: 'User Service', port: PORT, status: 'running' }));

// ── MongoDB connection ────────────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected — users DB');
    app.listen(PORT, () => {
      console.log(`✅  User Service running on http://localhost:${PORT}`);
      console.log(`📖  Swagger UI       → http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

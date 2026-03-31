const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 3003;
const MONGO_URI = 'mongodb+srv://samarakoonsarith:sariya123@cluster0.mqo6ik9.mongodb.net/Shoplytic_db?appName=Cluster0';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Order Service API', version: '1.0.0', description: 'Manages order creation and lifecycle.' },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Direct (native)' },
      { url: 'http://localhost:3000',    description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/orders', orderRoutes);
app.get('/', (req, res) => res.json({ service: 'Order Service', port: PORT, status: 'running' }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected — orders DB');
    app.listen(PORT, () => {
      console.log(`✅  Order Service running on http://localhost:${PORT}`);
      console.log(`📖  Swagger UI       → http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => { console.error(err.message); process.exit(1); });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = 3005;
const MONGO_URI = 'mongodb+srv://samarakoonsarith:sariya123@cluster0.mqo6ik9.mongodb.net/Shoplytic_db?appName=Cluster0';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Notification Service API', version: '1.0.0', description: 'Sends and manages user notifications (email, SMS, push).' },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Direct (native)' },
      { url: 'http://localhost:3000',    description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/notifications', notificationRoutes);
app.get('/', (req, res) => res.json({ service: 'Notification Service', port: PORT, status: 'running' }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected — notifications DB');
    app.listen(PORT, () => {
      console.log(`✅  Notification Service running on http://localhost:${PORT}`);
      console.log(`📖  Swagger UI       → http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => { console.error(err.message); process.exit(1); });

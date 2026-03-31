const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = 3004;
const MONGO_URI =
  "mongodb+srv://samarakoonsarith:sariya123@cluster0.mqo6ik9.mongodb.net/Shoplytic_db?appName=Cluster0";

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment Service API",
      version: "1.0.0",
      description: "Handles payment processing and refunds.",
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: "Direct (native)" },
      { url: "http://localhost:3000", description: "Via API Gateway" },
    ],
  },
  apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/payments", paymentRoutes);
app.get("/", (req, res) =>
  res.json({ service: "Payment Service", port: PORT, status: "running" }),
);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected — payments DB");
    app.listen(PORT, () => {
      console.log(`✅  Payment Service running on http://localhost:${PORT}`);
      console.log(`📖  Swagger UI       → http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

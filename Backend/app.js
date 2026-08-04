const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const connectDB = require("./config/db");
dotenv.config();

connectDB();

const auth = require("./routers/authRouter");
const courses = require("./routers/courseRouter");
const assignments = require("./routers/assignmentRouter");
const students = require("./routers/StudentRouter");

const app = express();
const PORT = process.env.PORT || 3333;

const swaggerDocument = YAML.load(path.join(__dirname, "swagger", "swagger.yaml"));

app.use(cors());

app.use(express.json());

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", auth);
app.use("/api/courses", courses);
app.use("/api/assignments", assignments);
app.use("/api/students", students);



// Default route
app.get("/", (req, res) => {
  res.end("Welcome to the backend server! Now API is ready to use.");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});

module.exports = app;

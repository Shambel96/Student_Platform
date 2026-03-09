// Entry point for the backend server
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require("./routers/authRouter");
const courses = require("./routers/courseRouter");
const assignments = require("./routers/assignmentRouter");

const app = express();
const PORT = process.env.PORT || 3333;

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Mount routers
app.use("/api/auth", auth);
app.use("/api/courses", courses);
app.use("/api/assignments", assignments);

// Default route
app.get("/", (req, res) => {
  res.end("Welcome to the backend server! Now API is ready to use.");
});

// Server started here
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port : ${PORT}`);
});

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();

connectDB();

const auth = require("./routers/authRouter");
const courses = require("./routers/courseRouter");
const assignments = require("./routers/assignmentRouter");

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());

app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/courses", courses);
app.use("/api/assignments", assignments);



// Default route
app.get("/", (req, res) => {
  res.end("Welcome to the backend server! Now API is ready to use.");
});

export default app;

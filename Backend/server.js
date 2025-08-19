// Entry point for the backend server
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3333;
// connect to DB
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.end("Welcome to the backend server! Now API is ready to use.");
});

// Server started here
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port : ${PORT}`);
});

// To connect with our database using mongoose
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const url = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("DB connected successfully: ");
  } catch (err) {
    console.log("DB not connected successfully:", err.message);
  }
};

module.exports = connectDB;

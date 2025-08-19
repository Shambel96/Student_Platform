// To connect with our database using mongoose
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3333;
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

// To connect with our database using mongoose
const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/student_platform";
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("DB connected successfully: ");
  } catch (err) {
    console.log("DB not connected successfully:", err.message);
  }
};
connectDB();

module.exports = connectDB;

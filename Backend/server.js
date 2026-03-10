const dotenv = require("dotenv");
const app = require("./app");
dotenv.config();



const PORT = process.env.PORT || 3333;

// Server started here
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port : ${PORT}`);
});

const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3333;

// Server started here to listen to the port
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port : ${PORT}`);
});

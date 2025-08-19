const database = require("../controllers/StudentControllers");
const User = require("../models/User");

class UserRepository {
  async getAllUsers() {
    return await database.getAllUsers();
  }
}

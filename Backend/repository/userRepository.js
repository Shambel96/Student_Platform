const User = require("../models/User");

class UserRepository {
  async findById(id) {
    return await User.findById(id).select("-password -refreshToken");
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    return await User.create(userData);
  }
}

module.exports = new UserRepository();

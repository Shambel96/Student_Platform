const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (require a valid JWT)
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Retrieve user and attach to request object
    req.user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!req.user) {
      return res.status(401).json({ message: "User not found with this token" });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Not authorized to access this route" });
  }
};

// Middleware to authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${
          req.user ? req.user.role : "undefined"
        } is not authorized to access this route`,
      });
    }
    next();
  };
};

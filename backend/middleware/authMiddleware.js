const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("========== AUTH MIDDLEWARE ==========");

  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);
    console.log("JWT Secret Loaded:", !!process.env.JWT_SECRET);

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log(
      "Token received:",
      token ? token.substring(0, 20) + "..." : "NO TOKEN"
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Token verified:", decoded);

    req.user = decoded;

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;
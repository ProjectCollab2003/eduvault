import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required. Please sign in.",
    });
  }

  const secret = process.env.JWT_SECRET || "eduvault_jwt_super_secret_key_2026_production_ready";

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token. Please sign in again.",
      });
    }

    req.user = user;
    next();
  });
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires ${role} role`,
      });
    }
    next();
  };
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  const secret = process.env.JWT_SECRET || "eduvault_jwt_super_secret_key_2026_production_ready";

  jwt.verify(token, secret, (err, user) => {
    if (!err) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  });
};

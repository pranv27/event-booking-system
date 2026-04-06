const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Using db directly to fetch user
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
      if (!rows[0]) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = rows[0];
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('JWT Token expired. Please login again.');
      } else {
        console.error('JWT Verification Error:', error.message);
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Added checks for req.user and req.user.role for robustness
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'undefined'} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
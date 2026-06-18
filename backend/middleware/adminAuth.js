// middleware/adminAuth.js
// Admin-only middleware — must be used AFTER the auth middleware

const adminAuth = (req, res, next) => {
  // req.user is set by the auth middleware
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

module.exports = adminAuth;

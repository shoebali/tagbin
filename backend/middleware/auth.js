const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied: No token provided' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // Attach user info to the request object
      // Check if roles are specified; if so, check if the user's role is included
      if (!roles.length || roles.includes(payload.role)) {
        return next(); // Proceed to the next middleware/controller
      }
      return res.status(403).json({ message: 'Forbidden' }); // Role not authorized
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };
};

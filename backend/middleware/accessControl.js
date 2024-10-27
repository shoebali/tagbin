const accessControl = (req, res, next) => {
    const accessKey = req.headers['x-access-key'];
  
    // Check if the access key matches the environment variable
    if (accessKey && accessKey === process.env.ACCESS_KEY) {
      next(); // Proceed to the next middleware or route handler
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  };
  
  module.exports = accessControl;
  
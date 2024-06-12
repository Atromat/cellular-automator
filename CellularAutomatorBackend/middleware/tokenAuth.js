require("dotenv").config();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
 
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed try Again' });
  }
};
require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization || req.cookies.authToken;

  if (!token) {
    return res.status(403).json("Cannot access this route because a token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("THE DECODED", decoded);
    req.user = decoded;
    
  } catch (err) {
    console.log("Invalid Token", err);
  }
  return next();
};

module.exports = verifyToken

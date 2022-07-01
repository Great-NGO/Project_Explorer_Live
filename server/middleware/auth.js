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

/* Assign verifyToken method to the variable name authorize. (i.e Creating a middleware function called authorize which is just the verifyToken method) */
const authorize = verifyToken;

// Check user in session
const checkUser = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers.authorization || req.cookies.authToken
  if (!token) {
    req.user = undefined
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("THE DECODED", decoded);
      req.user = decoded;
    } catch (error) {
      console.log("Invalid Token ", error)
      return res.status(400).json({error:"Invalid token"})
    }
}
  return next();
}

module.exports = {
  verifyToken,
  authorize,
  checkUser
}

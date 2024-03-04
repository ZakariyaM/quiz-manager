const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.token = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = verifyToken;

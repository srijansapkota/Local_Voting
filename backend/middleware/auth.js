const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({error: "Please login to continue"})
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({error: "Invalid or expired token"})
  }
}
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Please login to continue to the site" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    req.user = decoded.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token, please login again" });
  }
};

module.exports = auth;

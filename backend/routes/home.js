const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Make this route public for auth check
router.get("/", (req, res) => {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    jwt.verify(token, process.env.JWT_Secret);
    res.json({ authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;

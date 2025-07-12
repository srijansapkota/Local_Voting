const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

// JWT-based auth status endpoint
router.get("/status", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ user: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    res.json({ user: decoded.id });
  } catch (err) {
    return res.status(401).json({ user: null });
  }
});

module.exports = router;

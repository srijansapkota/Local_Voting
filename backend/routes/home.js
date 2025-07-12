const express = require("express");
const router = express.Router();

// Make this route public for auth check
router.get("/", (req, res) => {
  if (req.cookies && req.cookies.token) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;

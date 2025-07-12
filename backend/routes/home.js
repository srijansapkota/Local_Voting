const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/home", auth, (req, res) => {
  res.json({ message: "Welcome to the home page!" });
});

module.exports = router;

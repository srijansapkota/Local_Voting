const express = require("express");
const router = express.Router();
const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../controllers/utils");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // If password is not hashed, compare directly
    // If you hash passwords, use bcrypt.compare
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const userModel = require("../models/users");
const { generateToken } = require("../controllers/utils");

router.post("/signup", async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    generateToken(user._id, res);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

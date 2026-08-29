const express = require("express");
const router = express.Router()
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateToken = (userId, res) => {
  const isProduction = process.env.NODE_ENV == 'production';
  const token = jwt.sign({ id: userId }, process.env.JWT_Secret, {expiresIn: "30d"})

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30*24*60*60*1000
  })
}

router.post("/signup", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    generateToken(newUser._id, res);
    res.status(201).json({ id: newUser._id, name: newUser.name, email:newUser.email })
  } catch (err) {
    res.status(400).json({error: err.message})
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({error: "No user found"})
    }
    if (user.password !== password) {
      return res.status(400).json({error: "Invalid email or password"})
    }
    generateToken(user._id, res);
    res.status(200).json({message: "Login Successful"})
  }catch (err) {
      res.status(500).json({ error: err.message });
    }
})

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({message: "logged out"})
})

router.get("/status", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false, user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    res.json({authenticated:true, user:decoded.id})
  } catch (err) {
    res.status(401).json({authenticated: false, user:null})
  }
})

module.exports = router;
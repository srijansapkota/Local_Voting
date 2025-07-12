const jwt = require("jsonwebtoken");

const generateToken = (userID, res) => {
  const token = jwt.sign({ id: userID }, process.env.JWT_Secret, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

module.exports = { generateToken };

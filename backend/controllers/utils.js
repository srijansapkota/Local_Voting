const jwt = require("jsonwebtoken");

const generateToken = (userID, res) => {
  const token = jwt.sign({ id: userID }, process.env.JWT_Secret, {
    expiresIn: "30d",
  });
 
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, 
    sameSite: isProduction ? "none" : "lax", 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
};

module.exports = { generateToken };

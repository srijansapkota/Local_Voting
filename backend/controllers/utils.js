const jwt = require("jsonwebtoken");

const generateToken = (userID, res) => {
  const token = jwt.sign({ id: userID }, process.env.JWT_Secret, {
    expiresIn: "30d",
  });
  // Set cookie options based on environment
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // only secure in production
    sameSite: isProduction ? "none" : "lax", // allow cross-site in prod, lax locally
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // domain: can be set if needed for subdomains
  });
};

module.exports = { generateToken };

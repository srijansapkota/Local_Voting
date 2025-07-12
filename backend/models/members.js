const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Only create the model if it doesn't already exist
const Member = mongoose.models.Member || mongoose.model("Member", memberSchema);

module.exports = Member; 
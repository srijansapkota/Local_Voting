const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  memberId: { type: mongoose.Schema.Types.Mixed, required: true }, // Accept both string and number
  voteType: { type: String, enum: ["like", "dislike"], required: true },
});

// Only create the model if it doesn't already exist
const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);

module.exports = Vote; 
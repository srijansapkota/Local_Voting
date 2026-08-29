const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetId: { type: String, required: true },
  category: { type: String, enum: ["members", "feedback", "entities"], required: true },
  voteType: { type: String, enum: ["like", "dislike", "up", "down"], required: true }
});

voteSchema.index({ userId: 1, targetId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 }
});

const feedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  like: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 }
});

const entitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  image: { type: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 }
});

module.exports = {
  Member: mongoose.model("Member", memberSchema),
  Feedback: mongoose.model("Feedback", feedbackSchema),
  Entity: mongoose.model("Entity", entitySchema)
};
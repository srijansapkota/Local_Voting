const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback..js");
const auth = require("../middleware/auth");
const FeedbackVote = require("../models/feedbackVotes");

// Create feedback (protected)
router.post("/", auth, async (req, res) => {
  try {
    const { id, question } = req.body;

    if (!id || !question) {
      return res.status(400).json({ error: "ID and question are required" });
    }

    const existing = await Feedback.findOne({ id });
    if (existing) {
      return res.status(409).json({ error: "Feedback already exists" });
    }

    const feedback = await Feedback.create({ id, question });
    res.status(201).json(feedback);
  } catch (err) {
    console.error("[POST /feedback]", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get feedback with voting status
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ id: String(req.params.id) });
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    // Check if user is authenticated (token exists)
    const token = req.cookies.token;
    let userVote = null;
    let hasVoted = false;
    let voteType = null;

    if (token) {
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_Secret);
        const userId = decoded.id;

        // Check if user has voted for this feedback
        const existingVote = await FeedbackVote.findOne({ 
          userId: userId, 
          feedbackId: String(req.params.id) 
        });

        if (existingVote) {
          hasVoted = true;
          voteType = existingVote.voteType;
          userVote = existingVote;
        }
      } catch (err) {
        // Token is invalid, treat as unauthenticated
        console.log("Invalid token in feedback route:", err.message);
      }
    }

    // Return feedback data with voting status
    res.json({
      ...feedback.toObject(),
      hasVoted,
      voteType,
      userVote
    });
  } catch (err) {
    console.error("[GET /feedback/:id]", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Handle voting (protected)
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user; // From auth middleware
    const feedbackId = String(req.params.id);

    if (!type || !["like", "dislike"].includes(type)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    // Check if user has already voted
    const existingVote = await FeedbackVote.findOne({ userId, feedbackId });
    
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted for this feedback" });
    }

    // Create the vote record
    const newVote = new FeedbackVote({
      userId,
      feedbackId,
      voteType: type
    });
    await newVote.save();

    // Update feedback vote count
    const feedback = await Feedback.findOne({ id: feedbackId });
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    if (type === "like") {
      feedback.like += 1;
    } else if (type === "dislike") {
      feedback.dislike += 1;
    }
    await feedback.save();

    // Return updated feedback data with voting status
    res.json({
      ...feedback.toObject(),
      hasVoted: true,
      voteType: type,
      userVote: newVote
    });
  } catch (err) {
    console.error("[POST /feedback/:id/vote]", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already voted for this feedback" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Vote = require("../models/votes");
const Member = require("../models/members");

// Get member data with voting status for authenticated users
router.get("/:id", async (req, res) => {
  try {
    let memberId = String(req.params.id);
    let member = await Member.findOne({ id: memberId });
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
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

        // Check if user has voted for this member
        const existingVote = await Vote.findOne({ 
          userId: userId, 
          memberId: memberId 
        });

        if (existingVote) {
          hasVoted = true;
          voteType = existingVote.voteType;
          userVote = existingVote;
        }
      } catch (err) {
        // Token is invalid, treat as unauthenticated
        console.log("Invalid token in members route:", err.message);
      }
    }

    // Return member data with voting status
    res.json({
      ...member.toObject(),
      hasVoted,
      voteType,
      userVote
    });
  } catch (err) {
    console.error("Error in GET /:id:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Vote endpoint - requires authentication
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user; // From auth middleware
    const memberId = String(req.params.id);

    if (!type || !["like", "dislike"].includes(type)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({ userId, memberId });
    
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted for this member" });
    }

    // Create the vote record
    const newVote = new Vote({
      userId,
      memberId,
      voteType: type
    });
    await newVote.save();

    // Update member vote count
    const member = await Member.findOneAndUpdate(
      { id: memberId },
      { $inc: { [type]: 1 } },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Return updated member data with voting status
    res.json({
      ...member.toObject(),
      hasVoted: true,
      voteType: type,
      userVote: newVote
    });
  } catch (err) {
    console.error("Error in POST /:id/vote:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already voted for this member" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

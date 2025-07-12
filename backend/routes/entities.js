const express = require("express");
const router = express.Router();
const Entity = require("../models/entities");
const auth = require("../middleware/auth");
const EntityVote = require("../models/entityVotes");

// Get all entities
router.get("/", async (req, res) => {
  try {
    const entities = await Entity.find();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single entity by id with voting status
router.get("/:id", async (req, res) => {
  try {
    const entity = await Entity.findOne({ id: req.params.id });
    if (!entity) return res.status(404).json({ error: "Entity not found" });

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

        // Check if user has voted for this entity
        const existingVote = await EntityVote.findOne({ 
          userId: userId, 
          entityId: req.params.id 
        });

        if (existingVote) {
          hasVoted = true;
          voteType = existingVote.voteType;
          userVote = existingVote;
        }
      } catch (err) {
        // Token is invalid, treat as unauthenticated
        console.log("Invalid token in entities route:", err.message);
      }
    }

    // Return entity data with voting status
    res.json({
      ...entity.toObject(),
      hasVoted,
      voteType,
      userVote
    });
  } catch (err) {
    console.error("Error in GET /:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Vote endpoint - requires authentication
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user; // From auth middleware
    const entityId = req.params.id;

    if (!type || !["up", "down"].includes(type)) {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    // Check if user has already voted
    const existingVote = await EntityVote.findOne({ userId, entityId });
    
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted for this entity" });
    }

    // Create the vote record
    const newVote = new EntityVote({
      userId,
      entityId,
      voteType: type
    });
    await newVote.save();

    // Update entity vote count
    const entity = await Entity.findOne({ id: entityId });
    if (!entity) {
      return res.status(404).json({ error: "Entity not found" });
    }

    if (type === "up") {
      entity.upvotes += 1;
    } else if (type === "down") {
      entity.downvotes += 1;
    }
    await entity.save();

    // Return updated entity data with voting status
    res.json({
      ...entity.toObject(),
      hasVoted: true,
      voteType: type,
      userVote: newVote
    });
  } catch (err) {
    console.error("Error in POST /:id/vote:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already voted for this entity" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

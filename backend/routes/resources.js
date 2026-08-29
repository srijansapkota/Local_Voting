const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Member, Feedback, Entity } = require("../models/resources");
const Vote = require("../models/vote");
const auth = require("../middleware/auth");

const models = {
  members: Member,
  feedback: Feedback,
  entities: Entity
};

router.get("/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    const Model = models[category];
    if (!Model) return res.status(400).json({ error: "Invalid route category" });

    const item = await Model.findOne({ id })
    if (!item) return res.status(404).json({ error: "Item not found" });

    let hasVoted = false;
    let voteType = null;
      const token = req.cookies.token 

    if (token) {
      try {
      const decoded =  jwt.verify(token, process.env.JWT_Secret);
        const existingVote = await Vote.findOne({ userId: decoded.id, targetId : id, category })
        if (existingVote) {
          hasVoted = true;
          voteType = existingVote.voteType
        }
      } catch (err) {
      
      }
    }
     res.json({ ...item.toObject(), hasVoted, voteType });
  }catch (err) {
      res.status(500).json({ error: err.message });
    }
})


router.post("/:category/:id/vote", auth, async (req, res) => {
  try {
    const { category, id } = req.params;
    const { type } = req.body;
    const Model = models[category];
    if (!Model) return res.status(400).json({ error: "Invalid route category" });

    const existingVote = await Vote.findOne({ userId: req.user, targetId: id, category });
    if (existingVote) {
      return res.status(400).json({
        error: "You have already voted"
      })
    }

    const updateField = (type === "up" || type ==="like")?  (category === "entities" ? "upvotes" : "like")
          : (category === "entities" ? "downvotes" : "dislike");

    const updatedItem = await Model.findOneAndUpdate(
          { id },
          { $inc: { [updateField]: 1 } },
          { new: true }
        );
      if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    await Vote.create({userId: req.user, targetId: id, category,voteType:type})
    res.json({ ...updatedItem.toObject(), hasVoted: true, voteType: type });
  }catch (err) {
      res.status(500).json({ error: err.message });
    }
})
module.exports = router;
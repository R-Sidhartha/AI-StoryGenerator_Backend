const express = require('express');
const router = express.Router();
const { Post, Vote } = require('../models/Schemas');
const fetchuser = require('../middleware/fetchuser');

// Upvote a post
router.post('/posts/:id/upvote', fetchuser, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'post not found' });
    }

    const userId = req.user.id;
     // Ensure that upvotes is a valid number before incrementing
     if (isNaN(post.upvotes)) {
      post.upvotes = 0; // Initialize upvotes if it's not a number
    }

    // Check if the user has already upvoted the post
    const existingVote = await Vote.findOne({ post: id, user: userId });
    if (existingVote) {
      return res.status(400).json({ error: 'You have already upvoted this post' });
    }

    // Create a new vote
    const newVote = new Vote({ post: id, user: userId });
    await newVote.save();

    // Update the post's upvote count
    post.upvotes += 1;
    await post.save();

    res.json({ message: 'Upvoted successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Post, Vote } = require('../models/Schemas');
const fetchuser = require('../middleware/fetchuser');

// Upvote a post
router.post('/:id/upvote', fetchuser, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user.id;

  // Check if the user has already voted on the post
  const existingVote = await Vote.findOne({ post: id, user: userId });

  if (existingVote) {
    // If the user has already voted, remove their previous vote
    await Post.findByIdAndUpdate(id, {
      $inc: { upvotes: existingVote.type === 'upvote' ? -1 : 0, downvotes: existingVote.type === 'downvote' ? -1 : 0 },
    });
    await Vote.findByIdAndRemove(existingVote._id);
  }

    // Create a new upvote
    const newUpvote = new Vote({ post: id, user: userId, type: 'upvote' });
    await newUpvote.save();

    // Increment upvotes
    await Post.findByIdAndUpdate(id, { $inc: { upvotes: 1 } });

    const updatedPost = await Post.findById(id);

    res.json({ message: 'Upvoted successfully', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Downvote a post
router.post('/:id/downvote', fetchuser, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userId = req.user.id;

      // Check if the user has already voted on the post
      const existingVote = await Vote.findOne({ post: id, user: userId });

      if (existingVote) {
        // If the user has already voted, remove their previous vote
        await Post.findByIdAndUpdate(id, {
          $inc: { upvotes: existingVote.type === 'upvote' ? -1 : 0, downvotes: existingVote.type === 'downvote' ? -1 : 0 },
        });
        await Vote.findByIdAndRemove(existingVote._id);
      }

    // Create a new downvote
    const newDownvote = new Vote({ post: id, user: userId, type: 'downvote' });
    await newDownvote.save();

    // Increment downvotes
    await Post.findByIdAndUpdate(id, { $inc: { downvotes: 1 } });

    const updatedPost = await Post.findById(id);

    res.json({ message: 'Downvoted successfully', post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all votes for a post and check if the user has voted
router.get('/:id/votes', fetchuser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Find all votes for the post
    const allVotes = await Vote.find({ post: id });

    // Check if the user has already voted on the post
    const userVote = await Vote.findOne({ post: id, user: userId });

    res.json({
      message: 'Votes fetched successfully',
      votes: allVotes,
      userVote: userVote ? userVote.type : null, // Vote type of the user (upvote or downvote), or null if not voted
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

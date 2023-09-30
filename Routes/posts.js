const express = require('express');
const router = express.Router();
const { Post } = require('../models/Schemas');
const fetchuser = require('../middleware/fetchuser');

// Create a new post
router.post('/createpost', fetchuser, async (req, res) => {
  const { prompt, genre, content } = req.body;
  const userId = req.user.id; // Get the user ID from the middleware

  try {
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt not found' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    // Create a new post
    const newPost = new Post({
      user: userId, // Associate the story with the authenticated user
      prompt,
      genre,
      content,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get posts by user ID
router.get('/userposts/:userId', async (req, res) => {
  const userId = req.params.userId; // Get the user ID from the URL parameter

  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }

    // Fetch posts associated with the specified user ID
    const userPosts = await Post.find({ user: userId }).populate('user', 'UserName');

    res.json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/deletepost/:id',fetchuser, async (req, res) => {
    const { id } = req.params;

    try {
      // Fetch posts associated with the specified user ID
      const post = await Post.findOneAndDelete({ _id: id, user: req.user.id });
      if (!post) {
        return res.status(404).json({ error: 'post not found' });
      }
      res.json({ message: 'post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  // Fetch all posts
router.get('/allposts', async (req, res) => {
    try {
      const allPosts = await Post.find().populate('user', ['name', 'username']); // Replace with the fields you want to populate
  
      res.json(allPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
 

module.exports = router;

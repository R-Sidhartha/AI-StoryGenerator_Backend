const express = require('express');
const router = express.Router();
const { Story } = require('../models/Schemas');
const fetchuser = require('../middleware/fetchuser'); // Import the fetchuser middleware

// Get all stories
router.get('/stories', fetchuser, async (req, res) => {
    try {
      const stories = await Story.find({ user: req.user.id }).populate('prompt');
      res.json(stories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get a specific story by ID
  router.get('/stories/:id', fetchuser, async (req, res) => {
    const { id } = req.params;
    try {
      const story = await Story.findOne({ _id: id, user: req.user.id }).populate('prompt');
      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
      res.json(story);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new story
router.post('/addstory', fetchuser, async (req, res) => {
  const { prompt,genre, content } = req.body;
  const userId = req.user.id; // Get the user ID from the middleware

  try {
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const newStory = new Story({
      user: userId, // Associate the story with the authenticated user
      prompt,
      genre,
      content,
    });

    await newStory.save();
    res.json(newStory);
    return;
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a story
router.put('/editstory/:id', fetchuser, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const story = await Story.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Ensure the story belongs to the authenticated user
      { $set: { content } },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a story
router.delete('/deletestory/:id', fetchuser, async (req, res) => {
  const { id } = req.params;

  try {
    const story = await Story.findOneAndDelete({ _id: id, user: req.user.id });
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

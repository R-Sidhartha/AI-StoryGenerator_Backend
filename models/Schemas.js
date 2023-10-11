const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  UserName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date:{
    type:Date,
    default: Date.now
 } 
});


// Define Story Schema
const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
});
// Define post Schema
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  upvotes: {
    type: Number,
  },
  downvotes: {
    type: Number,
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vote',
  }],
  date:{
    type:Date,
    default: Date.now
 } 
});

// Define Vote Schema
const voteSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type:{
    type: String,
    required:true
  }
});

// Create models based on the schemas
const User = mongoose.model('User', userSchema);
const Story = mongoose.model('Story', storySchema);
const Vote = mongoose.model('Vote', voteSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { User, Story, Vote,Post };

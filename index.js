require("dotenv").config();
const main = require('./db');
const express = require('express');
const cors = require('cors');

const app = express()

main()

const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json())

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/story', require('./Routes/stories'))
app.use('/api/posts', require('./Routes/posts'))
app.use('/api/votes', require('./Routes/votes'))

app.listen(port, () => {
  console.log(`AI-StoryGenerator app listening on port ${port}`)
})
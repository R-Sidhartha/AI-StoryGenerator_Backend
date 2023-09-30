const mongoose = require('mongoose');
require('dotenv').config();
const mongodbURI=process.env.DATABASE;
async function main() {
    try {
      await mongoose.connect(`${mongodbURI}`)
      console.log("Connected to mongoose");
    } catch (err) {
      console.log(err);
    }
  }

module.exports = main;
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  image: String,
  tag: String,
  title: String,
  author: String,
});

module.exports = mongoose.model("Article", articleSchema);

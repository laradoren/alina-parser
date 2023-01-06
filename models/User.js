const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  login: String,
  token: String,
});

module.exports = mongoose.model("User", userSchema);

// Importing the mongoose library
const mongoose = require("mongoose");

// Creating a schema for urls
const urlSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  identifier: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Url", urlSchema, "urls");

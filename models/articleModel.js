const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please provide title"],
  },
  body: {
    type: String,
    required: true,
  },
  authorID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
},  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);

const mongoose = require("mongoose");

const SubscribedUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true
  },
  generalSub: {
    type: Boolean,
    default: false,
  },
  authorSubscription: []
});

module.exports = mongoose.model("SubUser", SubscribedUserSchema);

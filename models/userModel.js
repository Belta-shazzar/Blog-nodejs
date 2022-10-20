const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "please provide name"],
  },
  email: {
    type: String,
    required: [true, "email field cannot be empty"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password field cannot be empty"],
  },
  newsletterSub: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GENSALT));
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);

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
    // select: false,
    type: String,
    required: [true, "password field cannot be empty"],
  },
  subscribedUsers: [],
});

UserSchema.pre("save", async function () {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_GENSALT));
    this.password = await bcrypt.hash(this.password, salt);
  }
});

UserSchema.methods.comparePassword = async function (userPassword) {
  return (isMatch = await bcrypt.compare(userPassword, this.password));
};

module.exports = mongoose.model("User", UserSchema);

// $2a$10$UEis6hfkEapLwZTT3TB5W.lrB1i6jpEG3335T/inX5qOvtG5dMYBO
// $2a$10$UEis6hfkEapLwZTT3TB5W.lrB1i6jpEG3335T/inX5qOvtG5dMYBO

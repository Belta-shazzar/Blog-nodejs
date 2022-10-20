const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createJWT = (User) => {
  return jwt.sign(
    { userId: User._id, name: User.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

module.exports = { createJWT };

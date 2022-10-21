const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { UnauthorizedError, BadRequestError } = require("../errors")

const createJWT = (User) => {
  return jwt.sign(
    { userId: User._id, name: User.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

const JWTAuth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("Authenticaion Invalid")
  }
  const token = authHeader.split(" ")[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // check token expiation
    // if (payload.exp )
    // inject the user into the * route
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    throw new UnauthorizedError("Authenticaion Invalid")
  }
}

module.exports = { createJWT, JWTAuth };

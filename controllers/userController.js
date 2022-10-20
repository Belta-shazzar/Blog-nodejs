const User = require("../models/userModel");
const { createJWT } = require("../config/jwt.config");
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request")

const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = createJWT(user);
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  res.status(StatusCodes.OK).json({ email: email, password: password });
};

module.exports = { registerUser, loginUser };

const User = require("../models/userModel");
const { deleteClosedAccountArticle } = require("./articleController")
const { createJWT } = require("../config/jwt.config");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body });
  const jwt = createJWT(user);
  res
    .status(StatusCodes.CREATED)
    .json({ success: true, data: { name: user.name }, jwt });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(`The email: ${email} is not registered`);
  } else {
    const checkPassword = await user.comparePassword(password);

    if (!checkPassword) {
      throw new BadRequestError("password is incorrect");
    }
    const jwt = createJWT(user);
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: { name: user.name }, jwt });
  }
};

const deleteAccount = async (req, res) => {
  const { alsoDeleteArticles } = req.body
  const { userId } = req.user
  let articles = {
    "acknowledged": true,
    "deletedCount": 0,
    "Msg": "No article was deleted"
};

  if (alsoDeleteArticles) {
    articles = await deleteClosedAccountArticle(userId)
  }
  const user = await User.findOneAndDelete({ _id: userId });

  res.status(StatusCodes.OK).json({ success: true, articles });
};

module.exports = { registerUser, loginUser, deleteAccount };

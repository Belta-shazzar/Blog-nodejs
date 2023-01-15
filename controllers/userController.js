const User = require("../models/userModel");
// const { deleteClosedAccountArticle } = require("./articleController");
const Article = require("../models/articleModel");
const { createJWT } = require("../config/jwt.config");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { mailDetails } = require("../config/email.config");
const { generalSubscribersMail } = require("../service/subUserService");

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

const getAllUser = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json({ users });
};

const deleteAccount = async (req, res) => {
  const { alsoDeleteArticles } = req.body;
  const { userId } = req.user;

  // Default article msg to be returned
  let articles = {
    acknowledged: true,
    deletedCount: 0,
    Msg: "No article was deleted",
  };

  if (alsoDeleteArticles) {
    articles = await Article.deleteMany({ authorID: userId });
  }
  const user = await User.findOneAndDelete({ _id: userId });

  res.status(StatusCodes.OK).json({ success: true, articles });
};

const getAuthorById = async (userId) => {
  const author = await User.findOne({ _id: userId });

  if (!author) {
    throw new NotFoundError("Author does not exist");
  }
  return author;
};

const addSubUser = async (authorID, subscriberMail) => {
  const author = await User.findOne({ _id: authorID });

  if (!author) {
    throw new NotFoundError("Author does not exist");
  }

  author.subscribedUsers.push(subscriberMail);

  author.save();
  return author.name;
};

const notifySubscribedUsers = async (authorID, articleID, articleTitle) => {
  const author = await User.findOne({ _id: authorID }, "name subscribedUsers");
  const articleUrl = `${process.env.BASE_URL}/api/v1/article/${articleID}`;
  const subject = "New Published Article";
  const body = `<p>Hello there. \n ${author.name} just published a new article with the title "${articleTitle}". Wanna check it out? \n\n click <a href="${articleUrl}">this</a> link and enjoy your read!</p>`;

  mailDetails(author.subscribedUsers, subject, body);
};

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  deleteAccount,
  getAuthorById,
  addSubUser,
  notifySubscribedUsers,
};

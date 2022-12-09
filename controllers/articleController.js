const Article = require("../models/articleModel");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const { notifySubscribedUsers } = require("./userController")

const addArticle = async (req, res) => {
  req.body.authorID = req.user.userId;
  req.body.authorName = req.user.name;
  const authorID = req.body.authorID

  const article = await Article.create(req.body);

  notifySubscribedUsers(authorID, article._id, article.title);

  res.status(StatusCodes.CREATED).json({
    status: true,
    articleData: {
      articleId: article._id,
      title: article.title,
      article: article.body,
      authorName: req.user.name,
      views: article.views,
      likes: article.likes,
      dislikes: article.dislikes,
      createdAt: article.createdAt,
    },
  });
};

// add pagination later
const getAllArticle = async (req, res) => {
  const articles = await Article.find(
    {},
    "_id title authorName views likes dislikes"
  ).sort("createdAt");
  res.status(StatusCodes.OK).json({
    success: true,
    nbHits: articles.length,
    articles,
  });
};

const getMyArticles = async (req, res) => {
  const articles = await Article.find(
    { authorID: req.user.userId },
    "_id title views likes dislikes"
  ).sort("updatedAt");
  res
    .status(StatusCodes.OK)
    .json({ success: true, nbHits: articles.length, articles });
};

const getAnArticle = async (req, res) => {
  const { id: articleID } = req.params;
  const article = await Article.findOne(
    { _id: articleID },
    "_id title body authorID authorName views likes dislikes createdAt"
  );
  console.log(req)

  if (!article) {
    throw new NotFoundError("Article does not exist");
  }

  res.status(StatusCodes.OK).json({ success: true, article });
};

const updateAnArticle = async (req, res) => {
  const { id: articleID } = req.params;
  const authorID = req.user.userId;

  const article = await Article.findOneAndUpdate(
    { _id: articleID, authorID: authorID },
    req.body,
    {
      new: true,
    }
  );

  if (!article) {
    throw new NotFoundError("Article not found");
  }
  res.status(StatusCodes.OK).json({ success: true, article });
};

const deleteAnArticle = async (req, res) => {
  const { id: articleID } = req.params;
  const authorID = req.user.userId;

  const article = await Article.findOneAndDelete({
    _id: articleID,
    authorID: authorID,
  });

  if (!article) {
    throw new NotFoundError("Article not found");
  }
  res.status(StatusCodes.OK).json({ success: true });
};

// Delete multiple article by array of ids in req.body
const deleteArticles = async (req, res) => {
  const article = await Article.deleteMany({ _id: { $in: req.body.data } });
  res.status(StatusCodes.OK).json({ success: true, article });
};

// To be used in UserController, accessed by a user deleting his account (Optional)
// const deleteClosedAccountArticle = async (userId) => {
//   const articles = await Article.deleteMany({ authorID: userId });

//   return articles;
// }

module.exports = {
  addArticle,
  getAllArticle,
  getMyArticles,
  getAnArticle,
  updateAnArticle,
  deleteAnArticle,
  deleteArticles,
  // deleteClosedAccountArticle
};

// https://mongoosejs.com/docs/queries.html

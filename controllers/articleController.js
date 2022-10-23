const Article = require("../models/articleModel");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const addArticle = async (req, res) => {
  req.body.authorID = req.user.userId;
  req.body.authorName = req.user.name;

  const article = await Article.create(req.body);

  res.status(StatusCodes.CREATED).json({
    status: true,
    articleData: {
      articleId: article._id,
      title: article.title,
      authorName: req.user.name,
      likes: article.likes,
      dislikes: article.dislikes,
    },
  });
};

// add pagination later
const getAllArticle = async (req, res) => {
  const articles = await Article.find({}, "_id title likes dislikes").sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({
    success: true,
    nbHits: articles.length,
    articles,
  });
};

const getAnArticle = async (req, res) => {
  const { id: articleID } = req.params;
  const article = await Article.findOne({ _id: articleID }, "_id title body authorID authorName views likes dislikes createdAt");

  if (!article) {
    throw new NotFoundError("Article does not exist");
  }

  res.status(StatusCodes.OK).json({ success: true, article });
};

module.exports = { addArticle, getAllArticle, getAnArticle };

// https://mongoosejs.com/docs/queries.html

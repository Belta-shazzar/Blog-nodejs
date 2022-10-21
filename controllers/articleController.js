const Article = require("../models/articleModel");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const addArticle = async (req, res) => {
  req.body.author = req.user.userId;

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
  const articles = await Article.find({}, "_id title likes dislikes").sort("createdAt");
  res.status(StatusCodes.OK).json({
    success: true,
    nbHits: articles.length,
    articles
  });
};

module.exports = { addArticle, getAllArticle };


// https://mongoosejs.com/docs/queries.html

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

module.exports = { addArticle };

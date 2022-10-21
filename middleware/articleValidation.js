const { check, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

exports.validateArticle = [
  check("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Title cannot be empty!")
    .bail()
    .isLength({ max: 60 })
    .withMessage("Maximum characters for title is 60")
    .bail(),
  check("body")
  .escape()
  .notEmpty()
  .withMessage("Article body cannot be empty")
  .bail()
  .isLength({ min: 10 })
  .withMessage("Article is too short"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: errors.array() });
      }
      next();
  }
];

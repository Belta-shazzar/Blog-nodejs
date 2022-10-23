const express = require("express");
const { validateArticle } = require("../middleware/articleValidation");
const { JWTAuth } = require("../config/jwt.config");

const {
  addArticle,
  getAllArticle,
  getAnArticle,
} = require("../controllers/articleController");

const router = express.Router();

router.route("/").post(JWTAuth, validateArticle, addArticle).get(getAllArticle);
router.route("/:id").get(getAnArticle);

module.exports = router;

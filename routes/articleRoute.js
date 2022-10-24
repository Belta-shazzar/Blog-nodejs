const express = require("express");
const { validateArticle } = require("../middleware/articleValidation");
const { JWTAuth } = require("../config/jwt.config");

const {
  addArticle,
  getAllArticle,
  getAnArticle,
  updateAnArticle,
  deleteAnArticle,
} = require("../controllers/articleController");

const router = express.Router();

router.route("/").post(JWTAuth, validateArticle, addArticle).get(getAllArticle);
router
  .route("/:id")
  .get(getAnArticle)
  .patch(JWTAuth, validateArticle, updateAnArticle)
  .delete(JWTAuth, deleteAnArticle);

module.exports = router;

const express = require("express");
const { validateArticle } = require("../middleware/articleValidation");
const { JWTAuth } = require("../config/jwt.config");

const { addArticle } = require("../controllers/articleController");

const router = express.Router();

router.route("/").post(JWTAuth, validateArticle, addArticle);

module.exports = router;

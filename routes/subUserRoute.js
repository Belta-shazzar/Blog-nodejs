const express = require("express");
const {
  userGeneralSubscription,
  subscribeToAnAuthor,
} = require("../controllers/subUserController");

const router = express.Router();

router.post("/", userGeneralSubscription);
router.post("/author", subscribeToAnAuthor);

module.exports = router;

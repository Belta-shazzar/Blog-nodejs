const express = require("express");
const {
    userGeneralSubscription,
} = require("../controllers/subUserController");
const router = express.Router();

router.post("/", userGeneralSubscription);

module.exports = router;

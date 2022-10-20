const express = require("express");
const { validateUser } = require("../middleware/validation");

const { registerUser, loginUser } = require("../controllers/userController");


const router = express.Router();

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);

module.exports = router;

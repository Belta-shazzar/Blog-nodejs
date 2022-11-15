const express = require("express");
const { validateUser } = require("../middleware/userValidation");
const { JWTAuth } = require("../config/jwt.config");

const { registerUser, loginUser, deleteAccount } = require("../controllers/userController");


const router = express.Router();

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);
router.delete("/delete-account", JWTAuth,  deleteAccount)

module.exports = router;

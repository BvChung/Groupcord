const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getCurrentUser,
} = require("../controller/userController");

const { authWithToken } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/", loginUser);
router.get("/currentUser", authWithToken, getCurrentUser);

module.exports = router;

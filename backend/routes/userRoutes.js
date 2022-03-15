const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getCurrentUser,
} = require("../controller/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/", loginUser);
router.get("/currentUser", protect, getCurrentUser);

module.exports = router;

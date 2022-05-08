const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getAllUsers,
	updateUser,
} = require("../controller/userController");

const { authWithToken } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/", loginUser);
router.get("/all", authWithToken, getAllUsers);
router.put("/me", authWithToken, updateUser);

module.exports = router;

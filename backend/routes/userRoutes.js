const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	updateUsername,
	updateEmail,
	updatePassword,
	updateAvatar,
} = require("../controller/userController");

const { authWithToken } = require("../middleware/authMiddleware");
const { uploadFile } = require("../middleware/multerMiddleware");

router.post("/register", registerUser);
router.post("/", loginUser);

router.put("/account/username", authWithToken, updateUsername);
router.put("/account/email", authWithToken, updateEmail);
router.put("/account/password", authWithToken, updatePassword);
router.put("/account/profile", [authWithToken, uploadFile], updateAvatar);

module.exports = router;

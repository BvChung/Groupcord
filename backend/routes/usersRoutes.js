const express = require("express");
const router = express.Router();
const {
	updateUsername,
	updateEmail,
	updatePassword,
	updateAvatar,
} = require("../controller/users/settingsController");
const {
	loginUser,
	registerUser,
	logoutUser,
} = require("../controller/users/accessController");

const { verifyJWT } = require("../middleware/authJWT");
const { convertFile } = require("../middleware/convertFile");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/logout", logoutUser);

router.put("/settings/username", verifyJWT, updateUsername);
router.put("/settings/email", verifyJWT, updateEmail);
router.put("/settings/password", verifyJWT, updatePassword);
router.put("/settings/avatar", [verifyJWT, convertFile], updateAvatar);

module.exports = router;

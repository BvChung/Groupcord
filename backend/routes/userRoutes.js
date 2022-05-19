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

const { verifyJWT } = require("../middleware/authJWT");
const { uploadFile } = require("../middleware/uploadFile");

router.post("/register", registerUser);
router.post("/", loginUser);

router.put("/account/username", verifyJWT, updateUsername);
router.put("/account/email", verifyJWT, updateEmail);
router.put("/account/password", verifyJWT, updatePassword);
router.put("/account/profile", [verifyJWT, uploadFile], updateAvatar);

module.exports = router;

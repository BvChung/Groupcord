const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
	registerUser,
	loginUser,
	getAllUsers,
	updateAccount,
	updateProfilePicture,
	testImage,
} = require("../controller/userController");

const { authWithToken } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "backend/uploads/images");
	},
	filename: (req, file, cb) => {
		console.log(file);
		// cb(null, file.originalname);
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const uploadFile = multer({ storage });

router.post("/register", registerUser);
router.post("/", loginUser);
router.post("/test", [uploadFile.single("image")], testImage);

router.get("/all", authWithToken, getAllUsers);
router.put("/account", authWithToken, updateAccount);
router.put(
	"/account/profile",
	[authWithToken, uploadFile.single("image")],
	updateProfilePicture
);
// router.put("/me", [authWithToken, uploadImage], updateUser);

module.exports = router;

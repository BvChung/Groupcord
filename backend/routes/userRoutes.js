const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getAllUsers,
	updateAccount,
	updateAvatar,
} = require("../controller/userController");

const { authWithToken } = require("../middleware/authMiddleware");
const { uploadFile } = require("../middleware/multerMiddleware");

router.post("/register", registerUser);
router.post("/", loginUser);
router.get("/all", authWithToken, getAllUsers);
router.put("/account", authWithToken, updateAccount);
router.put("/account/profile", [authWithToken, uploadFile], updateAvatar);

module.exports = router;

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "backend/uploads/images");
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + path.extname(file.originalname));
// 	},
// });

// const uploadFile = multer({ storage, limits: { fileSize: 1 * 1000 * 1000 } });
// router.put(
// 	"/account/profile",
// 	[authWithToken, uploadFile.single("image")],
// 	updateAvatar
// );

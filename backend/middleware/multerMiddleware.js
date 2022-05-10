const multer = require("multer");
const path = require("path");
const asyncHandler = require("express-async-handler");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "backend/uploads/images");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage,
	// File size limit of <= 1 MB
	limits: { fileSize: 1 * 1000 * 1000 },
}).single("image");

const uploadFile = asyncHandler(async (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(400);
			next(err);
		}

		next();
	});
});

module.exports = { uploadFile };

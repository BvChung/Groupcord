const multer = require("multer");
const asyncHandler = require("express-async-handler");
const DataUriParser = require("datauri/parser");
const parser = new DataUriParser();

// Multer => middleware for handling multipart/form-data which is used for uploading files.
// Multer adds a body object and a file or files object to the request object.
// Data URI is a base64 encoded string that represents a file.
// DataUriParser converts file buffer to => base64 encoded string => upload to Cloudinary

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	// File size limit of <= 1 MB
	limits: { fileSize: 1 * 1000 * 1000 },
}).single("image");

const convertFile = asyncHandler(async (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			// If file size too large then return error
			res.status(400);
			return next(err);
		}

		req.file.originalname = Date.now() + req.file.originalname;

		const convertFileBuffer = parser.format(
			req.file.originalname,
			req.file.buffer
		);

		req.body = convertFileBuffer;

		next();
	});
});

module.exports = { convertFile };

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// JWT token is => Bearer token

const protect = asyncHandler(async (req, res, next) => {
	// Initialize the token
	let token;

	// Checking for authorization token in header
	// In http headers the token always starts with "Bearer" to be authentic
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from the token
			req.user = await User.findById(decodedToken.id).select("-password");

			next();
		} catch (err) {
			console.error(err);
			res.status(401);
			throw new Error("Not authorized");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

module.exports = { protect };

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// JWT token is => Bearer token
// authMiddleware returns the user(object) based on the token of the request to server

const verifyJWT = asyncHandler(async (req, res, next) => {
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
			const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

			// Get user from the token
			// .select("-password") removes the password from req.user
			req.user = await User.findById(decodedToken.id).select("-password");
			// console.log(req.user);

			next();
		} catch (err) {
			// console.error(err);
			res.status(403);
			throw new Error("Unauthorized, invalid token.");
		}
	}
	if (!token) {
		res.status(403);
		throw new Error("Unauthorized, no JSON Web Token.");
	}
});

module.exports = { verifyJWT };

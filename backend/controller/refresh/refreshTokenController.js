const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const { generateAccessToken } = require("../../helper/JWTGeneration");

// @desc Issue new access tokens
// @route GET /api/refresh
// @access Public
const handleRefreshToken = asyncHandler(async (req, res) => {
	try {
		const cookies = req.cookies;

		if (!cookies?.jwt) return res.sendStatus(401);

		const refreshToken = cookies.jwt;

		const foundUser = await User.findOne({ refreshToken: refreshToken });

		if (!foundUser) return res.sendStatus(403);

		const decodedToken = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET
		);

		const accessToken = generateAccessToken(decodedToken.id);

		return res.json({ accessToken });
	} catch (error) {
		res.status(403);
		throw new Error("Invalid refresh token.");
	}
});

module.exports = {
	handleRefreshToken,
};

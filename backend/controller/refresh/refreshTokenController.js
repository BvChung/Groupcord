const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const { generateAccessToken } = require("../../helper/helperfunctions");

const handleRefreshToken = asyncHandler(async (req, res) => {
	const cookies = req.cookies;
	console.log(cookies);

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;
	console.log(refreshToken);

	const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

	const foundUser = await User.findOne({ _id: decodedToken.id });

	if (!foundUser) return res.sendStatus(404);

	const accessToken = generateAccessToken(decodedToken.id);

	return res.json({ accessToken });
});

module.exports = {
	handleRefreshToken,
};

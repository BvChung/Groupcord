const jwt = require("jsonwebtoken");

// JWT Token functions -------------------------------

const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: "30m",
	});
};

const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "1d",
	});
};

module.exports = { generateAccessToken, generateRefreshToken };

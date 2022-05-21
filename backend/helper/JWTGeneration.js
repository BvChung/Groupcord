const jwt = require("jsonwebtoken");

// JWT Token functions -------------------------------

const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: "3s",
	});
};

const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "1h",
	});
};

module.exports = { generateAccessToken, generateRefreshToken };

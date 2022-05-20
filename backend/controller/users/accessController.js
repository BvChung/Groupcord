const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../helper/helperfunctions");
const nodemon = require("nodemon");

// For schema data:
// .id => 6278dd9dadc7cdbc6f7ec28c
// ._id => new ObjectId("6278dd9dadc7cdbc6f7ec28c")

// @desc Login user
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check for user based on email
	const user = await User.findOne({ email });

	// bcrypt.compare() compares password from request and hashed password from database schema
	if (user && (await bcrypt.compare(password, user.password))) {
		// Create JWT refresh token
		const refreshToken = generateRefreshToken(user._id);
		await User.findByIdAndUpdate(
			user._id,
			{
				refreshToken,
			},
			{
				new: true,
			}
		);

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			userAvatar: user.userAvatar,
			accessToken: generateAccessToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Email and/or password do not match.");
	}
});

// @desc Register new user
// @route POST /api/user/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, username, email, password } = req.body;

	// Check if user exists in the database based on email
	const emailExists = await User.findOne({ email });
	const usernameExists = await User.findOne({ username });

	if (emailExists) {
		res.status(409);
		throw new Error("This email address is already in use.");
	}
	if (usernameExists) {
		res.status(409);
		throw new Error("This username is taken. Try another.");
	}
	if (password.slice(0, 1) === " " || password.slice(-1) === " ") {
		res.status(400);
		throw new Error("Your password cannot begin or end with a blank space.");
	}

	// Hash(encrypt) password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create User using mongoose schema
	const user = await User.create({
		name,
		username,
		email,
		password: hashedPassword,
	});

	// Create JWT refresh token
	const refreshToken = generateRefreshToken(user._id);

	await User.findByIdAndUpdate(
		user._id,
		{
			refreshToken,
		},
		{
			new: true,
		}
	);

	// If user is succesfully created
	if (user) {
		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			accessToken: generateAccessToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid user data");
	}
});

const logoutUser = asyncHandler(async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

	if (!decodedToken) return res.sendStatus(403);

	const foundUser = await User.findOne({ refreshToken });

	if (!foundUser) return res.sendStatus(404);

	if (foundUser.id !== decodedToken.id) return res.sendStatus(403);

	// Remove refresh token + cookie when user logouts
	await User.findByIdAndUpdate(
		decodedToken.id,
		{
			$unset: {
				refreshToken: "",
			},
		},
		{
			new: true,
		}
	);

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

	return res.sendStatus(204);
});

module.exports = {
	loginUser,
	registerUser,
	logoutUser,
};

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = "backend/uploads/images/";
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Messages = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

// For schema data:
// .id => 6278dd9dadc7cdbc6f7ec28c
// ._id => new ObjectId("6278dd9dadc7cdbc6f7ec28c")

// Generate a JWT: used to validate user
const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: "1d",
	});
};
const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "1d",
	});
};

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, username, email, password } = req.body;

	// Check if user exists in the database based on email
	const emailExists = await User.findOne({ email });
	const usernameExists = await User.findOne({ username });

	if (emailExists) {
		res.status(400);
		throw new Error("This email address is already in use.");
	}
	if (usernameExists) {
		res.status(400);
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
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			token: generateAccessToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc Login user
// @route POST /api/
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
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			userAvatar: user.userAvatar,
			token: generateAccessToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Email and/or password do not match.");
	}
});

// @desc Update user data
// @route PUT /api/users/me
// @access Private

const updateUsername = asyncHandler(async (req, res) => {
	const currentUser = await User.findById(req.user._id);

	const { username } = req.body;

	if (currentUser.username === username) {
		res.status(400);
		throw new Error("Your new username cannot be the same as the original.");
	}

	// Update user information
	await User.findByIdAndUpdate(
		req.user._id,
		{
			username,
		},
		{
			new: true,
		}
	);

	// Find messages in Message schema with user id then update username
	await Messages.updateMany({ user: currentUser.id }, { username: username });

	// Update member list in Group Schema with new username
	await Conversation.updateMany(
		{
			members: {
				$elemMatch: {
					_id: currentUser.id,
					username: currentUser.username,
				},
			},
		},
		{ $set: { "members.$.username": username } }
	);

	return res.status(200).json({
		_id: currentUser.id,
		name: currentUser.name,
		username: username ? username : currentUser.username,
		email: currentUser.email,
		userAvatar: currentUser.userAvatar,
	});
});

const updateEmail = asyncHandler(async (req, res) => {
	const currentUser = await User.findById(req.user._id);

	const { email } = req.body;

	if (currentUser.email === email) {
		res.status(400);
		throw new Error("Your new email cannot be the same as the original.");
	}

	// Update user information
	await User.findByIdAndUpdate(
		req.user._id,
		{
			email,
		},
		{
			new: true,
		}
	);

	return res.status(200).json({
		_id: currentUser.id,
		name: currentUser.name,
		username: currentUser.username,
		email: email ? email : currentUser.email,
		userAvatar: currentUser.userAvatar,
	});
});

const updatePassword = asyncHandler(async (req, res) => {
	const currentUser = await User.findById(req.user._id);

	const { currentPassword, newPassword } = req.body;

	if (
		currentPassword &&
		!(await bcrypt.compare(currentPassword, currentUser.password))
	) {
		res.status(400);
		throw new Error("Current password is incorrect. Try again.");
	}

	if (currentPassword === newPassword) {
		res.status(400);
		throw new Error("Your new password cannot be the same as the original.");
	}

	if (newPassword.slice(0, 1) === " " || newPassword.slice(-1) === " ") {
		res.status(400);
		throw new Error(
			"Your new password cannot begin or end with a blank space."
		);
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(newPassword, salt);

	// Update user information
	await User.findByIdAndUpdate(
		req.user._id,
		{
			password: hashedPassword ? hashedPassword : currentUser.password,
		},
		{
			new: true,
		}
	);

	return res.status(200).json({
		_id: currentUser.id,
		name: currentUser.name,
		username: currentUser.username,
		email: currentUser.email,
		userAvatar: currentUser.userAvatar,
	});
});

const updateAvatar = asyncHandler(async (req, res) => {
	const currentUser = await User.findById(req.user._id);

	await User.findByIdAndUpdate(
		req.user._id,
		{
			userAvatar: req.file ? req.file.filename : currentUser.userAvatar,
		},
		{
			new: true,
		}
	);

	if (req.file !== currentUser.userAvatar) {
		// Find messages in Message schema with user id then update avatar
		await Messages.updateMany(
			{ user: currentUser.id },
			{ userAvatar: req.file.filename }
		);

		// Update member list in Group Schema with new avatar
		await Conversation.updateMany(
			{
				members: {
					$elemMatch: {
						_id: currentUser.id,
						userAvatar: currentUser.userAvatar,
					},
				},
			},
			{ $set: { "members.$.userAvatar": req.file.filename } }
		);
	}

	// Remove old image file if image req is successful and !default avatar
	if (req.file && currentUser.userAvatar !== "") {
		fs.unlink(`${path}${currentUser.userAvatar}`, (err) => {
			if (err) {
				console.error(`${currentUser.userAvatar} does not exist.`);
			}

			console.log(`${currentUser.userAvatar} was deleted`);
		});
	}

	return res.status(200).json({
		_id: currentUser.id,
		name: currentUser.name,
		username: currentUser.username,
		email: currentUser.email,
		userAvatar: req.file.filename,
	});
});

module.exports = {
	registerUser,
	loginUser,
	updateUsername,
	updateEmail,
	updatePassword,
	updateAvatar,
};

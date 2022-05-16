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
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
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

	// If user is succesfully created
	if (user) {
		return res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			token: generateToken(user._id),
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
		return res.status(201).json({
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			userAvatar: user.userAvatar,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Your email and/or password do not match.");
	}
});

// @desc Update user data
// @route PUT /api/users/me
// @access Private
const updateAccount = asyncHandler(async (req, res) => {
	const currentUser = await User.findById(req.user._id);

	const { username, email, currentPassword, newPassword } = req.body;

	// If user updates password then hash it
	let hashedPassword;
	if (
		currentPassword &&
		!(await bcrypt.compare(currentPassword, currentUser.password))
	) {
		res.status(400);
		throw new Error("Current password is incorrect. Try again.");
	}

	if (currentPassword && newPassword && currentPassword === newPassword) {
		res.status(400);
		throw new Error("New password cannot be the same as your last password.");
	}

	if (
		currentPassword &&
		newPassword &&
		(await bcrypt.compare(currentPassword, currentUser.password))
	) {
		const salt = await bcrypt.genSalt(10);
		hashedPassword = await bcrypt.hash(newPassword, salt);
	}

	// Update user information
	await User.findByIdAndUpdate(
		req.user._id,
		{
			username,
			email,
			password: hashedPassword ? hashedPassword : currentUser.password,
			// userAvatar: req.file ? req.file : currentUser.userAvatar,
		},
		{
			new: true,
		}
	);

	if (username !== currentUser.username) {
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
	}

	return res.status(200).json({
		_id: currentUser.id,
		name: currentUser.name,
		username: username ? username : currentUser.username,
		email: email ? email : currentUser.email,
		userAvatar: currentUser.userAvatar,
		token: generateToken(currentUser._id),
	});
});

const updateUsername = asyncHandler(async (req, res) => {
	const currentUser = await User.findById(req.user._id);

	const { username } = req.body;

	if (!username) return;

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
		token: generateToken(currentUser._id),
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
		token: generateToken(currentUser._id),
	});
});

const updatePassword = asyncHandler(async (req, res) => {
	const currentUser = await User.findById(req.user._id);

	const { currentPassword, newPassword } = req.body;

	let hashedPassword;
	if (
		currentPassword &&
		!(await bcrypt.compare(currentPassword, currentUser.password))
	) {
		res.status(400);
		throw new Error("Current password is incorrect. Try again.");
	}

	if (currentPassword && newPassword && currentPassword === newPassword) {
		res.status(400);
		throw new Error("Your new password cannot be the same as the original.");
	}

	if (
		currentPassword &&
		newPassword &&
		(await bcrypt.compare(currentPassword, currentUser.password))
	) {
		const salt = await bcrypt.genSalt(10);
		hashedPassword = await bcrypt.hash(newPassword, salt);
	}

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
		token: generateToken(currentUser._id),
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
		token: generateToken(currentUser._id),
	});
});

// @desc Get all registered user's username/id except for current user
// @route GET /api/users/all
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({}).select("username");

	const returnedUsers = users.filter((user) => {
		return user.username !== req.user.username;
	});

	return res.status(200).json(returnedUsers);
});

module.exports = {
	registerUser,
	loginUser,
	updateAccount,
	updateUsername,
	updateEmail,
	updatePassword,
	getAllUsers,
	updateAvatar,
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc Register new user
// @route POST /api/v1/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("Please fill in all fields");
	}

	// Check if user exists
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	// Hash(encrypt) password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create User
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
	});

	if (user) {
		return res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc Login new user
// @route POST /api/v1/login
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
			email: user.email,
		});
	} else {
		res.status(400);
		throw new Error("Invalid credentials");
	}
});

// @desc Get user data
// @route GET /api/v1/users/me
// @access Public
const getCurrentUser = asyncHandler(async (req, res) => {
	res.json({ message: "Current user" });
});

module.exports = { registerUser, loginUser, getCurrentUser };

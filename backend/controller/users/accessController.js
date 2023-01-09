const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../helper/JWTGeneration");

// For schema data:
// ._id => new ObjectId("6278dd9dadc7cdbc6f7ec28c")
// .id => 6278dd9dadc7cdbc6f7ec28c

// @desc Login user
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check for user based on email
	const foundUser = await User.findOne({ email });

	if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
		// bcrypt.compare() compares password from request and hashed password from database schema
		// Create JWT refresh token
		const refreshToken = generateRefreshToken(foundUser._id);

		await User.findByIdAndUpdate(
			foundUser._id,
			{
				refreshToken,
			},
			{
				new: true,
			}
		);

		res
			.status(200)
			.cookie("jwt", refreshToken, {
				sameSite: "strict",
				httpOnly: true,
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})
			.json({
				_id: foundUser.id,
				name: foundUser.name,
				username: foundUser.username,
				email: foundUser.email,
				userAvatar: foundUser.userAvatar,
				authenticationRole: foundUser.authenticationRole,
				accessToken: generateAccessToken(foundUser._id),
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
	if (password.length < 6) {
		res.status(400);
		throw new Error("Your password must be at least 6 characters.");
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

	// Create JWT refresh token based on Schema Id
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
		return res
			.status(201)
			.cookie("jwt", refreshToken, {
				sameSite: "strict",
				httpOnly: true,
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})
			.json({
				_id: user.id,
				name: user.name,
				username: user.username,
				email: user.email,
				userAvatar: user.userAvatar,
				accessToken: generateAccessToken(user._id),
			});
	} else {
		res.status(401);
		throw new Error("Invalid user data");
	}
});

// @desc Logout user
// @route PUT /api/user/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
	const cookies = req.cookies;

	// If no cookie => logout
	if (!cookies?.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken: refreshToken });

	// No token in DB => clear cookie + logout
	if (!foundUser) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		});
		return res.sendStatus(204);
	}

	// Remove refresh JWT + cookie + logout
	await User.findOneAndUpdate(
		{ refreshToken: refreshToken },
		{
			$unset: {
				refreshToken: "",
			},
		},
		{
			new: true,
		}
	);

	res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: true });

	return res.sendStatus(204);
});

module.exports = {
	loginUser,
	registerUser,
	logoutUser,
};

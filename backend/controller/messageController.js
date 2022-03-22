const asyncHandler = require("express-async-handler");

const Messages = require("../models/messageModel");

// @desc Get chatlogs
// @route GET /api/v1/chatlogs
// @access Private
const getMessages = asyncHandler(async (req, res) => {
	// Return messages based on user JWT
	const chatlog = await Messages.find({ user: req.user.id });

	// Return all messages
	const all = await Messages.find({});

	res.status(200).json({
		currentUserMessage: chatlog,
		allMessages: all,
	});
});

// @desc Set chatlogs
// @route POST /api/v1/chatlogs
// @access Private
const setMessages = asyncHandler(async (req, res) => {
	if (!req.body.message) {
		res.status(400);
		throw new Error("Please add a text field");
	}

	const chatlog = await Messages.create({
		message: req.body.message,
		user: req.user.id,
	});

	res.status(200).json(chatlog);
});

// @desc Update chatlogs
// @route PUT /api/v1/chatlogs
// @access Private
const updateMessages = asyncHandler(async (req, res) => {
	// Get the chatlog
	const chatlog = await Messages.findById(req.params.id);

	if (!chatlog) {
		res.status(400);
		throw new Error("Chatlog not found");
	}

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error("User not found");
	}

	// Check if logged in user matches the chatlog user
	if (chatlog.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error("User not authorized");
	}

	// Update the chatlog
	const updatedChatlog = await Messages.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);

	res.status(200).json(updatedChatlog);
});

// @desc Delete chatlogs
// @route DELETE /api/v1/chatlogs
// @access Private
const deleteMessages = asyncHandler(async (req, res) => {
	const chatlog = await Messages.findById(req.params.id);

	if (!chatlog) {
		res.status(400);
		throw new Error("Chatlog not found");
	}

	// Check for user
	if (!req.user) {
		res.status(401);
		throw new Error("User not found");
	}

	// Check if logged in user matches the chatlog user
	if (chatlog.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error("User not authorized");
	}

	await chatlog.remove();

	res.status(200).json({ id: req.params.id });
});

module.exports = { getMessages, setMessages, updateMessages, deleteMessages };

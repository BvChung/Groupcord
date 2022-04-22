const asyncHandler = require("express-async-handler");
const Messages = require("../models/messageModel");

// @desc Get messages
// @route GET /api/messages
// @access Private
const getMessages = asyncHandler(async (req, res) => {
	const { groupId } = req.query;

	const allMessages = await Messages.find({});

	// Return messages based on user JWT
	const userMessages = await Messages.find({ user: req.user.id });

	// find() has to match type in mongodb schema
	const groupMessages = await Messages.find({ groupId: groupId });

	return res.status(200).json({
		allMessages: allMessages,
		currentUserMessage: userMessages,
		groupMessages: groupMessages,
	});
});

// @desc Set messages
// @route POST /api/messages
// @access Private
const setMessages = asyncHandler(async (req, res) => {
	const { groupId } = req.body;
	// console.log(groupId);

	if (!req.body.message) {
		res.status(400);
		throw new Error("Please add a text field");
	}

	const timeNow = new Date();

	const convertedTime = timeNow.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
	});

	const convertedDate = timeNow.toLocaleString("en-US", {
		day: "numeric",
		month: "numeric",
	});

	const fullDate = timeNow.toLocaleString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const chatlog = await Messages.create({
		user: req.user.id,
		groupId: groupId,
		username: req.user.username,
		message: req.body.message,
		fullDate: fullDate,
		timeCreated: convertedTime,
		dateCreated: convertedDate,
	});

	return res.status(200).json(chatlog);
});

// @desc Update messages
// @route PUT /api/messages
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

	return res.status(200).json(updatedChatlog);
});

// @desc Delete messages
// @route DELETE /api/messages/:messageId
// @access Private
const deleteMessages = asyncHandler(async (req, res) => {
	const { messageId } = req.params;
	const deletedMessage = await Messages.findByIdAndDelete(messageId);

	return res.status(200).json(deletedMessage);
});

module.exports = { getMessages, setMessages, updateMessages, deleteMessages };

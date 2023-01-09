const asyncHandler = require("express-async-handler");
const Messages = require("../../models/messageModel");

// @desc Get messages
// @route GET /api/messages
// @access Private
const getMessages = asyncHandler(async (req, res) => {
	const { groupId } = req.query;

	// Return messages based on groupId
	const groupMessages = await Messages.find({ groupId: groupId });

	return res.status(200).json({
		groupMessages: groupMessages,
	});
});

// @desc Set messages
// @route POST /api/messages
// @access Private
const setMessages = asyncHandler(async (req, res) => {
	const { groupId } = req.body;

	if (!req.body.message) {
		res.status(400);
		throw new Error("Please add a text field");
	}

	const timeNow = new Date();
	const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const fullDate = timeNow.toLocaleString("en-US", {
		timeZone: userTimeZone,
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const chatlog = await Messages.create({
		user: req.user.id,
		username: req.user.username,
		userAvatar: req.user.userAvatar,
		groupId: groupId,
		message: req.body.message,
		fullDate: fullDate,
	});

	return res.status(200).json(chatlog);
});

// @desc Delete messages
// @route DELETE /api/messages/:messageId
// @access Private
const deleteMessages = asyncHandler(async (req, res) => {
	const { messageId } = req.params;
	const deletedMessage = await Messages.findByIdAndDelete(messageId);

	return res.status(200).json(deletedMessage);
});

module.exports = { getMessages, setMessages, deleteMessages };

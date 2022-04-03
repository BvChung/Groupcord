const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");

// @desc Get conversation
// @route Get /api/conversation
// @access Private

const getConversation = asyncHandler(async (req, res) => {
	const userConversations = await Conversation.find({ user: req.user.id });
	const allConversations = await Conversation.find({});

	return res.status(200).json({
		userConversations,
		allConversations,
	});
});

// @desc Create conversation
// @route POST /api/conversation
// @access Private
const createConversation = asyncHandler(async (req, res) => {
	const { messageReceiver, groupName, members } = req.body;

	// if (!messageReceiver) {
	// 	res.status(400);
	// 	throw new Error("Please add the receiver's name");
	// }

	const conversation = await Conversation.create({
		user: req.user.id,
		messageReceiver,
		groupName,
		members,
	});

	return res.status(200).json(conversation);
});

module.exports = { getConversation, createConversation };

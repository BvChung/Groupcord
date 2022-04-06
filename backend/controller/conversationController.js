const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");

// @desc Get chat groups based on user
// @route Get /api/conversation
// @access Private

const getConversation = asyncHandler(async (req, res) => {
	// const userConversations = await Conversation.find({ user: req.user.id });
	const userConversations = await Conversation.find({ members: req.user.id });
	const allConversations = await Conversation.find({});

	return res.status(200).json({
		userConversations,
		allConversations,
	});
});

// @desc Update each groups members
// @route PUT /api/conversation
// @access Private
const addConversationMembers = asyncHandler(async (req, res) => {
	const { id } = req.params;
});

// @desc Create conversation
// @route POST /api/conversation
// @access Private
const createConversation = asyncHandler(async (req, res) => {
	const { groupName, members } = req.body;

	// if (!) {
	// 	res.status(400);
	// 	throw new Error("Please add the receiver's name");
	// }

	const conversation = await Conversation.create({
		groupOwner: req.user.id,
		groupName,
		members: req.user.id,
	});

	return res.status(200).json(conversation);
});

module.exports = { getConversation, createConversation };

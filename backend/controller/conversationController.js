const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

// @desc Get chat groups based on user
// @route Get /api/conversation
// @access Private

const getConversation = asyncHandler(async (req, res) => {
	// const userConversations = await Conversation.find({ user: req.user.id });
	const userConversations = await Conversation.find({ membersId: req.user.id });

	return res.status(200).json({
		userConversations,
	});
});

const getMembers = asyncHandler(async (req, res) => {
	const users = await User.find({}).select("username");

	const returnedUsers = users.filter((user) => {
		return user.username !== req.user.username;
	});

	return res.status(200).json(returnedUsers);
});

// @desc Update each groups members
// @route PUT /api/conversation
// @access Private
const addGroupMembers = asyncHandler(async (req, res) => {
	const { groupId } = req.params;
	const { memberId } = req.body;

	const user = await User.findById(memberId).select("username");

	await Conversation.findByIdAndUpdate(
		groupId,
		{
			$addToSet: {
				membersId: memberId,
				members: { _id: memberId, username: user.username },
			},
		},
		{
			new: true,
		}
	);

	return res.status(200).json(memberId);
});

// @desc Create conversation
// @route POST /api/conversation
// @access Private
const createConversation = asyncHandler(async (req, res) => {
	const { groupName } = req.body;

	// if (!) {
	// 	res.status(400);
	// 	throw new Error("Please add the receiver's name");
	// }

	const conversation = await Conversation.create({
		groupOwner: req.user.id,
		groupName,
		membersId: req.user.id,
		members: { _id: req.user.id, username: req.user.username },
	});

	return res.status(200).json(conversation);
});

module.exports = {
	getConversation,
	createConversation,
	getMembers,
	addGroupMembers,
};

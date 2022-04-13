const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");

// @desc Get chat groups based on user
// @route Get /api/conversation
// @access Private

const getChatGroups = asyncHandler(async (req, res) => {
	// const userConversations = await Conversation.find({ user: req.user.id });
	const userConversations = await Conversation.find({ membersId: req.user.id });

	return res.status(200).json({
		userConversations,
	});
});

// @desc Create conversation
// @route POST /api/conversation
// @access Private
const createChatGroup = asyncHandler(async (req, res) => {
	const { groupName } = req.body;

	const conversation = await Conversation.create({
		groupOwner: req.user.id,
		groupName,
		membersId: req.user.id,
		members: { _id: req.user.id, username: req.user.username },
	});

	return res.status(200).json(conversation);
});

// @desc Delete group
// @route POST /api/conversation/:id
// @access Private
const deleteChatGroup = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const deleteGroup = await Conversation.findByIdAndDelete({ _id: id });

	return res.status(200).json(deleteGroup);
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

	const updatedMembers = await Conversation.findByIdAndUpdate(
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

	return res.status(200).json({
		updatedMembers: updatedMembers,
		memberChanged: memberId,
	});
});

// @desc Update each groups members
// @route PUT /api/conversation
// @access Private
const removeGroupMembers = asyncHandler(async (req, res) => {
	const { groupId } = req.params;
	const { memberId } = req.body;

	const user = await User.findById(memberId).select("username");

	const updatedMembers = await Conversation.findByIdAndUpdate(
		groupId,
		{
			$pull: {
				membersId: memberId,
				members: { _id: memberId, username: user.username },
			},
		},
		{
			new: true,
		}
	);

	return res.status(200).json({
		updatedMembers: updatedMembers,
		memberChanged: memberId,
	});
});

module.exports = {
	getChatGroups,
	createChatGroup,
	deleteChatGroup,
	getMembers,
	addGroupMembers,
	removeGroupMembers,
};

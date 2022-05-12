const asyncHandler = require("express-async-handler");
const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const Messages = require("../models/messageModel");

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
		members: {
			_id: req.user.id,
			username: req.user.username,
			userAvatar: req.user.userAvatar,
		},
	});

	return res.status(200).json(conversation);
});

// @desc Update Group
// @route PUT /api/conversation/:id
// @access Private
const updateChatGroupName = asyncHandler(async (req, res) => {
	const { groupId } = req.params;

	const updatedGroupName = await Conversation.findByIdAndUpdate(
		groupId,
		req.body,
		{
			new: true,
		}
	);
	const allGroups = await Conversation.find({ membersId: req.user.id });

	return res.status(200).json({
		allGroups,
		updatedGroupName,
	});
});

// @desc Delete group
// @route DELETE /api/conversation/:id
// @access Private
const deleteChatGroup = asyncHandler(async (req, res) => {
	// Delete group
	const deletedGroup = await Conversation.findByIdAndDelete(req.params.groupId);

	// Delete all messages associated with group in database
	await Messages.deleteMany({ groupId: req.params.groupId });

	const allGroups = await Conversation.find({ membersId: req.user.id });
	return res.status(200).json({
		allGroups,
		deletedGroup,
	});
});

// @desc Get members
// @route GET /api/conversation/members
// @access Private
const getMembers = asyncHandler(async (req, res) => {
	const registeredMembers = await User.find({}).select({
		username: 1,
		userAvatar: 1,
	});

	const returnedUsers = registeredMembers.filter((user) => {
		return user.username !== req.user.username;
	});

	return res.status(200).json(returnedUsers);
});

// @desc Update with new groups members
// @route PUT /api/conversation
// @access Private
const addGroupMembers = asyncHandler(async (req, res) => {
	const { groupId } = req.params;
	const { memberId } = req.body;

	const currentUser = await User.findById(memberId).select({
		username: 1,
		userAvatar: 1,
	});

	const updatedMembers = await Conversation.findByIdAndUpdate(
		groupId,
		{
			$addToSet: {
				membersId: memberId,
				members: currentUser,
			},
		},
		{
			new: true,
		}
	);

	return res.status(200).json({
		updatedMembers: updatedMembers,
		memberChanged: currentUser,
	});
});

// @desc Update each groups members
// @route PUT /api/conversation
// @access Private
const removeGroupMembers = asyncHandler(async (req, res) => {
	const { groupId } = req.params;
	const { memberId } = req.body;

	const currentUser = await User.findById(memberId).select({
		username: 1,
		userAvatar: 1,
	});

	const updatedMembers = await Conversation.findByIdAndUpdate(
		groupId,
		{
			$pull: {
				membersId: memberId,
				members: currentUser,
			},
		},
		{
			new: true,
		}
	);

	return res.status(200).json({
		updatedMembers: updatedMembers,
		memberChanged: currentUser,
	});
});

module.exports = {
	getChatGroups,
	createChatGroup,
	updateChatGroupName,
	deleteChatGroup,
	getMembers,
	addGroupMembers,
	removeGroupMembers,
};

const asyncHandler = require("express-async-handler");
const Conversation = require("../../models/conversationModel");
const Messages = require("../../models/messageModel");
const fs = require("fs");
const path = "backend/uploads/images/";

// @desc Get chat groups based on user
// @route Get /api/groups/
// @access Private
const getChatGroups = asyncHandler(async (req, res) => {
	const userConversations = await Conversation.find({ membersId: req.user.id });

	return res.status(200).json(userConversations);
});

// @desc Create group
// @route POST /api/groups/
// @access Private
const createChatGroup = asyncHandler(async (req, res) => {
	const { groupName } = req.body;

	const newConversation = await Conversation.create({
		groupOwner: req.user.id,
		groupName,
		membersId: req.user.id,
		members: {
			_id: req.user.id,
			username: req.user.username,
			userAvatar: req.user.userAvatar,
		},
	});

	return res.status(200).json(newConversation);
});

// @desc Delete group
// @route DELETE /api/groups/:groupId
// @access Private
const deleteChatGroup = asyncHandler(async (req, res) => {
	// Delete group
	const deletedGroup = await Conversation.findByIdAndDelete(req.params.groupId);

	// Delete all messages associated with group in database
	await Messages.deleteMany({ groupId: req.params.groupId });

	// Remove image file with group deletion
	if (deletedGroup.groupIcon !== "") {
		fs.unlink(`${path}${deletedGroup.groupIcon}`, (err) => {
			if (err) {
				console.error(`${deletedGroup.groupIcon} does not exist.`);
			}

			console.log(`${deletedGroup.groupIcon} was deleted`);
		});
	}

	const allGroups = await Conversation.find({ membersId: req.user.id });
	return res.status(200).json({
		allGroups,
		deletedGroup,
	});
});

// @desc Update group name
// @route PUT /api/groups/name/:groupId
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

// @desc Update group icon
// @route PUT /api/groups/icon/:groupId
// @access Private
const updateIcon = asyncHandler(async (req, res) => {
	const { groupId } = req.params;

	const currentGroup = await Conversation.findById(groupId);

	const updatedGroup = await Conversation.findByIdAndUpdate(
		groupId,
		{
			groupIcon: req.file ? req.file.filename : currentGroup.groupIcon,
		},
		{
			new: true,
		}
	);

	// Remove old image file if image req is successful and !default avatar
	if (req.file && currentGroup.groupIcon !== "") {
		fs.unlink(`${path}${currentGroup.groupIcon}`, (err) => {
			if (err) {
				console.error(`${currentGroup.groupIcon} does not exist.`);
			}

			console.log(`${currentGroup.groupIcon} was deleted`);
		});
	}

	return res.status(200).json(updatedGroup);
});

module.exports = {
	getChatGroups,
	createChatGroup,
	updateChatGroupName,
	updateIcon,
	deleteChatGroup,
};

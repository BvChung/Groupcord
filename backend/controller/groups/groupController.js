const asyncHandler = require("express-async-handler");
const Conversation = require("../../models/conversationModel");
const Messages = require("../../models/messageModel");
const cloudinary = require("../../cloudinary/cloudinaryConfig");

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

	// Delete old groupIcon from Cloudinary if default icon not present
	if (deletedGroup.groupIconCloudId !== "") {
		await cloudinary.uploader.destroy(deletedGroup.groupIconCloudId);
	}

	// Delete all messages associated with group in database
	await Messages.deleteMany({ groupId: req.params.groupId });

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

	// Upload image to Cloudinary
	const uploadedImage = await cloudinary.uploader.upload(req.body.content, {
		upload_preset: process.env.CLOUDINARY_ICON_UPLOAD,
		public_id: req.file.originalname,
	});

	// Delete old groupIcon from Cloudinary if default icon not present
	if (currentGroup.groupIconCloudId !== "") {
		await cloudinary.uploader.destroy(currentGroup.groupIconCloudId);
	}

	// Secure url => src={url} for image from Cloudinary to display on frontend
	// Public_id => used to remove images from Cloudinary when updated
	const updatedGroup = await Conversation.findByIdAndUpdate(
		groupId,
		{
			groupIcon: uploadedImage.secure_url,
			groupIconCloudId: uploadedImage.public_id,
		},
		{
			new: true,
		}
	);

	return res.status(200).json(updatedGroup);
});

module.exports = {
	getChatGroups,
	createChatGroup,
	deleteChatGroup,
	updateChatGroupName,
	updateIcon,
};

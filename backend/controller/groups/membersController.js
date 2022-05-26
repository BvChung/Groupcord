const asyncHandler = require("express-async-handler");
const Conversation = require("../../models/conversationModel");
const User = require("../../models/userModel");

// @desc Get members
// @route GET /api/groups/members
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

// @desc Add group members
// @route PUT /api/groups/members/add/:groupId
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
				members: {
					_id: currentUser.id,
					username: currentUser.username,
					userAvatar: currentUser.userAvatar,
				},
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

// @desc Remove group members
// @route PUT /api/groups/members/remove/:groupId
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
				members: {
					_id: currentUser.id,
					username: currentUser.username,
					userAvatar: currentUser.userAvatar,
				},
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
	getMembers,
	addGroupMembers,
	removeGroupMembers,
};

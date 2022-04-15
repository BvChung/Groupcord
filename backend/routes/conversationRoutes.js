const express = require("express");
const router = express.Router();
const {
	getChatGroups,
	createChatGroup,
	updateChatGroupName,
	deleteChatGroup,
	getMembers,
	addGroupMembers,
	removeGroupMembers,
} = require("../controller/conversationController");

const { authWithToken } = require("../middleware/authMiddleware");

router
	.route("/")
	.get(authWithToken, getChatGroups)
	.post(authWithToken, createChatGroup);

router.route("/members").get(authWithToken, getMembers);
router.route("/update/:groupId").put(authWithToken, updateChatGroupName);
router.route("/add/:groupId").put(authWithToken, addGroupMembers);
router.route("/remove/:groupId").put(authWithToken, removeGroupMembers);
router.route("/delete/:groupId").delete(authWithToken, deleteChatGroup);

module.exports = router;

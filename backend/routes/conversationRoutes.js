const express = require("express");
const router = express.Router();
const {
	getChatGroups,
	createChatGroup,
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

router.route("/:id").delete(authWithToken, deleteChatGroup);
router.route("/members").get(authWithToken, getMembers);
router.route("/add/:groupId").put(authWithToken, addGroupMembers);
router.route("/remove/:groupId").put(authWithToken, removeGroupMembers);

module.exports = router;

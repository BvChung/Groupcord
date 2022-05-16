const express = require("express");
const router = express.Router();
const {
	getChatGroups,
	createChatGroup,
	updateChatGroupName,
	updateIcon,
	deleteChatGroup,
	getMembers,
	addGroupMembers,
	removeGroupMembers,
} = require("../controller/conversationController");

const { authWithToken } = require("../middleware/authMiddleware");
const { uploadFile } = require("../middleware/multerMiddleware");

router
	.route("/")
	.get(authWithToken, getChatGroups)
	.post(authWithToken, createChatGroup);
router.route("/:groupId").delete(authWithToken, deleteChatGroup);

router.route("/members").get(authWithToken, getMembers);
router.route("/members/add/:groupId").put(authWithToken, addGroupMembers);
router.route("/members/remove/:groupId").put(authWithToken, removeGroupMembers);

router.route("/update/name/:groupId").put(authWithToken, updateChatGroupName);
router
	.route("/update/icon/:groupId")
	.put([authWithToken, uploadFile], updateIcon);

module.exports = router;

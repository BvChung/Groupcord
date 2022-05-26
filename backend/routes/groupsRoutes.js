const express = require("express");
const router = express.Router();
const {
	getChatGroups,
	createChatGroup,
	updateChatGroupName,
	updateIcon,
	deleteChatGroup,
} = require("../controller/groups/groupController");
const {
	getMembers,
	addGroupMembers,
	removeGroupMembers,
} = require("../controller/groups/membersController");

const { verifyJWT } = require("../middleware/authJWT");
const { uploadFile } = require("../middleware/uploadFile");

router
	.route("/")
	.get(verifyJWT, getChatGroups)
	.post(verifyJWT, createChatGroup);
router.route("/:groupId").delete(verifyJWT, deleteChatGroup);
router.route("/name/:groupId").put(verifyJWT, updateChatGroupName);
router.route("/icon/:groupId").put([verifyJWT, uploadFile], updateIcon);

router.route("/members").get(verifyJWT, getMembers);
router.route("/members/add/:groupId").put(verifyJWT, addGroupMembers);
router.route("/members/remove/:groupId").put(verifyJWT, removeGroupMembers);

module.exports = router;

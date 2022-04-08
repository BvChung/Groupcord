const express = require("express");
const router = express.Router();
const {
	getConversation,
	createConversation,
	getMembers,
	addGroupMembers,
} = require("../controller/conversationController");

const { authWithToken } = require("../middleware/authMiddleware");

router
	.route("/")
	.get(authWithToken, getConversation)
	.post(authWithToken, createConversation);

router.route("/members").get(authWithToken, getMembers);

router.route("/members/:groupId").put(authWithToken, addGroupMembers);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
	getConversation,
	createConversation,
	addGroupMembers,
} = require("../controller/conversationController");

const { authWithToken } = require("../middleware/authMiddleware");

router
	.route("/")
	.get(authWithToken, getConversation)
	.post(authWithToken, createConversation);

router.route("/:groupId").put(authWithToken, addGroupMembers);

module.exports = router;

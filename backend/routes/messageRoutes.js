// Creating routes into own folder
const express = require("express");
const router = express.Router();
const {
	getMessages,
	setMessages,
	deleteMessages,
} = require("../controller/messageController");

const { authWithToken } = require("../middleware/authMiddleware");

router
	.route("/")
	.get(authWithToken, getMessages)
	.post(authWithToken, setMessages);
router.route("/:messageId").delete(authWithToken, deleteMessages);

module.exports = router;

// Creating routes into own folder
const express = require("express");
const router = express.Router();
const {
	getMessages,
	setMessages,
	updateMessages,
	deleteMessages,
} = require("../controller/messageController");

const { authWithToken } = require("../middleware/authMiddleware");

router
	.route("/")
	.get(authWithToken, getMessages)
	.post(authWithToken, setMessages);
router
	.route("/:messageId")
	.put(authWithToken, updateMessages)
	.delete(authWithToken, deleteMessages);

module.exports = router;

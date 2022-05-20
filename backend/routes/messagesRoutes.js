// Creating routes into own folder
const express = require("express");
const router = express.Router();
const {
	getMessages,
	setMessages,
	deleteMessages,
} = require("../controller/messages/messageController");

const { verifyJWT } = require("../middleware/authJWT");

router.route("/").get(verifyJWT, getMessages).post(verifyJWT, setMessages);
router.route("/:messageId").delete(verifyJWT, deleteMessages);

module.exports = router;

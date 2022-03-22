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

// router.get("/", getMessages);
// router.post("/", setMessages);
// router.put("/:id", updateMessages);
// router.delete("/:id", deleteMessages);
router
	.route("/")
	.get(authWithToken, getMessages)
	.post(authWithToken, setMessages);
router
	.route("/:id")
	.put(authWithToken, updateMessages)
	.delete(authWithToken, deleteMessages);

module.exports = router;

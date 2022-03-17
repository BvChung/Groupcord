// Creating routes into own folder
const express = require("express");
const router = express.Router();
const {
	getChatlogs,
	setChatlogs,
	updateChatlogs,
	deleteChatlogs,
} = require("../controller/chatlogController");

const { authWithToken } = require("../middleware/authMiddleware");

// router.get("/", getChatlogs);
// router.post("/", setChatlogs);
// router.put("/:id", updateChatlogs);
// router.delete("/:id", deleteChatlogs);
router
	.route("/")
	.get(authWithToken, getChatlogs)
	.post(authWithToken, setChatlogs);
router
	.route("/:id")
	.put(authWithToken, updateChatlogs)
	.delete(authWithToken, deleteChatlogs);

module.exports = router;

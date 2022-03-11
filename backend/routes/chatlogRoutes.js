// Creating routes into own folder
const express = require("express");
const router = express.Router();
const {
	getChatlogs,
	setChatlogs,
	updateChatlogs,
	deleteChatlogs,
} = require("../controller/chatlogController");

const { protect } = require("../middleware/authMiddleware");

// router.get("/", getChatlogs);
// router.post("/", setChatlogs);
// router.put("/:id", updateChatlogs);
// router.delete("/:id", deleteChatlogs);
router.route("/").get(protect, getChatlogs).post(protect, setChatlogs);
router
	.route("/:id")
	.put(protect, updateChatlogs)
	.delete(protect, deleteChatlogs);

module.exports = router;

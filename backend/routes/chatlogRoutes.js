// Creating routes into own folder
const express = require("express");
const router = express.Router();
const {
	getChatlogs,
	setChatlogs,
	updateChatlogs,
	deleteChatlogs,
} = require("../controller/chatlogController");

router.route("/").get(getChatlogs).post(setChatlogs);
router.route("/:id").put(updateChatlogs).delete(deleteChatlogs);

// router.get("/", getChatlogs);
// router.post("/", setChatlogs);
// router.put("/:id", updateChatlogs);
// router.delete("/:id", deleteChatlogs);

module.exports = router;

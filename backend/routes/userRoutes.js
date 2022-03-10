const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getCurrentUser,
} = require("../controller/userController");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/current", getCurrentUser);

module.exports = router;

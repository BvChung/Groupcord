const express = require("express");
const router = express.Router();
const {
	handleRefreshToken,
} = require("../controller/refresh/refreshTokenController");

router.get("/", handleRefreshToken);

module.exports = router;

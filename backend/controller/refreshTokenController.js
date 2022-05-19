const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const refresh = asyncHandler(async (req, res) => {
	const { token } = req.body;

	const updatedUser = await User.findByIdAndUpdate(
		req.user._id,
		{
			token,
		},
		{ new: true }
	);

	res.status(200).json(updatedUser);
});

module.exports = {
	refresh,
};

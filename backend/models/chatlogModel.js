// Define schema
const mongoose = require("mongoose");

const chatlogsSchema = mongoose.Schema(
	{
		user: {
			// Used to associate user with a chatlog
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		message: {
			type: String,
			required: [true, "Please add a text value"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Chatlogs", chatlogsSchema);

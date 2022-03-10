// Define schema
const mongoose = require("mongoose");

const chatlogsSchema = mongoose.Schema(
	{
		// Needed to associate user with a chatlog
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		text: {
			type: String,
			required: [true, "Please add a text value"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Chatlogs", chatlogsSchema);

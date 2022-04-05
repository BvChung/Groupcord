// Define schema
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
	{
		user: {
			// Used to associate user with a chatlog
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		username: {
			type: String,
			required: [true, "Please add a username"],
		},
		groupId: {
			type: String,
			required: [true, "Please add a groupId value"],
		},
		message: {
			type: String,
			required: [true, "Please add a text value"],
		},
		dateCreated: {
			type: String,
			required: [true, "Please add when message was created"],
		},
		timeCreated: {
			type: String,
			required: [true, "Please add when message was created"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Messages", messageSchema);

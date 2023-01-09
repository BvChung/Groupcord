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
			ref: "User",
		},
		userAvatar: {
			type: String,
			default: "",
			ref: "User",
		},
		groupId: {
			type: String,
			required: [true, "GroupId is required"],
			ref: "Conversation",
		},
		message: {
			type: String,
			required: [true, "Message is required"],
		},
		fullDate: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Messages", messageSchema);

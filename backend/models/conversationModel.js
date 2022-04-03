const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
	{
		user: {
			// Used to associate user with a chatlog
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		messageReceiver: {
			type: String,
		},
		members: {
			type: Array,
		},
		groupName: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Conversation", conversationSchema);

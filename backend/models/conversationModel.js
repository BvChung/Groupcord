const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
	{
		groupOwner: {
			// Used to associate user with a chatlog
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		membersId: [mongoose.Schema.Types.ObjectId],
		members: [Object],
		groupName: {
			type: String,
			required: true,
		},
		groupIcon: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Conversation", conversationSchema);

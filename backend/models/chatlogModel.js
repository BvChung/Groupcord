// Define schema
const mongoose = require("mongoose");

const chatlogsSchema = mongoose.Schema(
	{
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

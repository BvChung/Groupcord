const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			default: "",
		},
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			default: "",
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			default: "",
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			default: "",
		},
		userAvatar: {
			type: String,
			default: "",
		},
		userAvatarCloudId: {
			type: String,
			default: "",
		},
		refreshToken: {
			type: String,
			default: "",
		},
		authenticationRole: {
			type: Number,
			default: +process.env.MEMBER_ROLE,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);

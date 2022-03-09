const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		// Connecting to mongoDB with mongoose w/
		const connect = await mongoose.connect(process.env.MONGO_URI);

		console.log(`MongoDB connected: ${connect.connection.host}`.cyan.underline);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = connectDB;

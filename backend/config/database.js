const mongoose = require("mongoose");

// Connect to the mongoDB database using mongoose
const connectDatabase = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGO_URI);

		console.log(`MongoDB connected: ${connect.connection.host}`.cyan.underline);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

module.exports = connectDatabase;

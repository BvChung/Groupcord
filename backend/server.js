const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3001;
const cors = require("cors");
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

connectDB();

// nodemon server to observe changes
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// When front end reaches /api/chatlogs app looks into route folder to establish route
app.use("/api/v1/chatlogs", require("./routes/chatlogRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

// Error handler that converts standard Express error html to a JSON error message using custom middleware
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

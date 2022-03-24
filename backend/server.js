const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const port = process.env.PORT || 3001;
const { Server } = require("socket.io");
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDatabase = require("./config/database");

connectDatabase();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`A user connected ${socket.id}`.brightMagenta.underline);

	socket.on("send_message", (data) => {
		console.log(data);

		// broadcast sends message to everyone connected to server except you
		socket.broadcast.emit("receive_message", data);
	});

	socket.on("disconnect", () => {
		console.log(`A user disconnected ${socket.id}`.brightRed.underline);
	});
});

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// When front end reaches /api/chatlogs app looks into route folder to establish route
app.use("/api/v1/messages", require("./routes/messageRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));

// Error handler that converts standard Express error html to a JSON error message using custom middleware
app.use(errorHandler);

// app.listen(port, () => {
// 	console.log(`Server started on port ${port}`);
// });

server.listen(port, () => {
	console.log(`Server started on port: ${port}`.brightWhite);
});

module.exports = { io };

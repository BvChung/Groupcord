const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const port = process.env.PORT || 3001;
const { Server } = require("socket.io");
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDatabase = require("./config/database");
const jwt = require("jsonwebtoken");
const getPreviousRoom = require("./helper/helperfunctions");

connectDatabase();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// When front end reaches /api/chatlogs app looks into route folder to establish route
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/conversation", require("./routes/conversationRoutes"));

// Error handler that converts standard Express error html to a JSON error message using custom middleware
app.use(errorHandler);

// Socket.io data emission
io.on("connection", (socket) => {
	console.log(`A user connected ${socket.id}`.brightMagenta.underline);

	socket.on("join_room", (room, joinRoomConfirm) => {
		const previousRoom = getPreviousRoom(socket.rooms);
		if (previousRoom) {
			socket.leave(previousRoom);
		}

		console.log(`User ${socket.id} Joined room: ${room}`.brightGreen.underline);
		socket.join(room);
		joinRoomConfirm(`Joined ${room}`);
	});

	socket.on("send_message", (data) => {
		console.log(data);
		socket.to(data.groupId).emit("receive_message", data);
	});

	socket.on("msg", (data) => {
		console.log(data);
	});

	socket.on("disconnect", () => {
		console.log(`A user disconnected ${socket.id}`.brightRed.underline);
	});
});

server.listen(port, () => {
	console.log(`Server started on port: ${port}`.brightWhite);
});

module.exports = io;

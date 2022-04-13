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
let users = [];
const createUser = (socketId, username, userId) => {
	const newUser = {
		socketId: socketId,
		username: username,
		userId: userId,
	};

	users = users.filter((user) => {
		return user.username !== newUser.username;
	});

	users.push(newUser);
};

const removeUser = (socketId) => {
	return (users = users.filter((user) => {
		user.socketId !== socketId;
	}));
};

io.on("connection", (socket) => {
	console.log(`A user connected ${socket.id}`.brightMagenta.underline);
	// createUser(socket.id, "guest");
	socket.on("user_connected", (data) => {
		// console.log(data);
		createUser(socket.id, data.username, data._id);
		// users[data._id] = socket.id;
		console.log(users);
	});

	console.log(socket.rooms);

	let currentRoom;
	let currentId;

	socket.on("join_room", (room, roomConfirmation) => {
		const previousRoom = getPreviousRoom(socket.rooms);
		if (previousRoom) {
			socket.leave(previousRoom);
		}

		console.log(`User ${socket.id} Joined room: ${room}`.brightGreen.underline);
		socket.join(room);
		currentRoom = room;
		console.log(socket.rooms);
		roomConfirmation(`Joined ${room}`);
	});

	socket.on("send_message", (data) => {
		// console.log(data);
		// socket.to(currentRoom).emit("receive_message", data);
		socket.to(data.groupId).emit("receive_message", data);
	});

	socket.on("send_group", (data) => {
		if (Object.keys(data).length > 1) {
			// console.log(data);
			// socket.to(currentRoom).emit("receive_group", data);
		}
	});

	socket.on("send_members", (data) => {
		if (Object.keys(data).length > 1) {
			const member = users.find((user) => {
				return user.userId === data.memberChanged && user.userId;
			});
			console.log(member);

			if (member) {
				console.log(member.socketId);
				socket
					.to(member.socketId)
					.to(currentRoom)
					.emit("receive_members", data);
			} else {
				socket.to(currentRoom).emit("receive_members", data);
			}
		}
	});

	// && Object.keys(data.membersData).length > 1

	socket.on("send_id", (data) => {
		// console.log(data);
		// currentId = data;
	});

	socket.on("disconnect", () => {
		console.log(`A user disconnected ${socket.id}`.brightRed.underline);
	});
});

server.listen(port, () => {
	console.log(`Server started on port: ${port}`.brightWhite);
});

module.exports = io;

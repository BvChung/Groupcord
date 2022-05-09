const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const port = process.env.PORT || 3001;
const { Server } = require("socket.io");
const colors = require("colors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDatabase = require("./config/database");
const jwt = require("jsonwebtoken");
const { getPreviousRoom, createUser } = require("./helper/helperfunctions");

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

// Frontend
// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "../frontend/build")));

// 	app.get("*", (req, res) =>
// 		res.sendFile(
// 			path.resolve(__dirname, "../", "frontend", "build", "index.html")
// 		)
// 	);
// } else {
// 	app.get("/", (req, res) => res.send("Please set to production"));
// }

// Error handler that converts standard Express error html to a JSON error message using custom middleware
app.use(errorHandler);

// Socket.io data emission
let connectedUsers = [];

io.on("connection", (socket) => {
	console.log(`A user connected ${socket.id}`.brightMagenta.underline);

	socket.on("user_connected", (userData) => {
		connectedUsers = createUser(
			connectedUsers,
			socket.id,
			userData.username,
			userData._id
		);
		console.log(connectedUsers);
	});

	let currentRoom;
	socket.on("join_room", (room) => {
		const previousRoom = getPreviousRoom(socket.rooms);
		if (previousRoom) {
			socket.leave(previousRoom);
		}

		console.log(`User ${socket.id} Joined room: ${room}`.brightGreen.underline);
		socket.join(room);
		currentRoom = room;
	});

	socket.on("send_message", (messageData) => {
		if (Object.keys(messageData).length === 0) return;
		// console.log(messageData);
		// socket.to(currentRoom).emit("receive_message", messageData);
		socket.to(messageData.groupId).emit("receive_message", messageData);
	});

	socket.on("send_deleted_message", (messageData) => {
		if (Object.keys(messageData).length === 0) return;
		socket.to(currentRoom).emit("receive_deleted_message", messageData);
	});

	socket.on("send_group_data", (groupData) => {
		if (Object.keys(groupData).length === 0) return;
		console.log(groupData);

		const member = connectedUsers.find((user) => {
			return user.userId === groupData.memberChanged._id && user.userId;
		});

		if (member) {
			socket
				.to(member.socketId)
				.to(currentRoom)
				.emit("receive_group_data", groupData);
		} else {
			socket.to(currentRoom).emit("receive_group_data", groupData);
		}
	});

	socket.on("send_group_name_updated", (groupNameData) => {
		if (Object.keys(groupNameData).length === 0) return;
		socket.broadcast.emit("receive_group_name_updated", groupNameData);
	});

	socket.on("send_group_deleted", (groupDeletedData) => {
		if (Object.keys(groupDeletedData).length === 0) return;
		socket.broadcast.emit("receive_group_deleted", groupDeletedData);
	});

	// && Object.keys(data.membersData).length > 1

	socket.on("disconnect", () => {
		console.log(`A user disconnected ${socket.id}`.brightRed.underline);
	});
});

server.listen(port, () => {
	console.log(`Server started on port: ${port}`.brightWhite);
});

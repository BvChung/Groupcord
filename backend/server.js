const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const port = process.env.PORT || 3001;
const path = require("path");
const { Server } = require("socket.io");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const { backendErrorHandler } = require("./middleware/errorMessage");
const connectDatabase = require("./config/database");
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

// If /images path is used => prevent API request => instead goes to directory uploads/images/image.png
app.use("/images", express.static(path.join(__dirname, "uploads/images")));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		optionSuccessStatus: 200,
	})
);

// Middleware for cookies
app.use(cookieParser());

// When front end reaches /api/chatlogs app looks into route folder to establish route
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/refresh", require("./routes/refreshTokenRoutes"));
app.use("/api/groups", require("./routes/groupsRoutes"));
app.use("/api/messages", require("./routes/messagesRoutes"));

// Error handler that converts standard Express error => thrown JSON error message
app.use(backendErrorHandler);

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

// Socket.io data emission
let connectedUsers = [];

io.on("connection", (socket) => {
	// Web socket data transmission ----------------------------------
	console.log(`A user connected ${socket.id}`.brightMagenta.underline);
	socket.on("user_connected", (userData) => {
		connectedUsers = createUser(
			connectedUsers,
			socket.id,
			userData.username,
			userData._id
		);
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

		socket.to(messageData.groupId).emit("receive_message", messageData);
		storeMessageData = messageData;
	});

	socket.on("send_deleted_message", (messageData) => {
		if (Object.keys(messageData).length === 0) return;

		socket.to(currentRoom).emit("receive_deleted_message", messageData);
		storeDeletedMessageData = messageData;
	});

	socket.on("send_message_avatar_updated", (messageData) => {
		if (Object.keys(messageData).length === 0) return;

		socket.broadcast.emit("receive_message_avatar_updated", messageData);
		storeAvatarData = messageData;
	});

	socket.on("send_message_username_updated", (messageData) => {
		if (Object.keys(messageData).length === 0) return;

		socket.broadcast.emit("receive_message_username_updated", messageData);
		storeUsernameData = messageData;
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

	socket.on("send_added_group_member", (groupData) => {
		if (Object.keys(groupData).length === 0) return;

		// const member = connectedUsers.find((user) => {
		// 	return user.userId === groupData.memberChanged._id && user.userId;
		// });

		// if (member) {
		// 	socket
		// 		.to(member.socketId)
		// 		.to(currentRoom)
		// 		.emit("receive_added_group_member", groupData);
		// 	console.log(groupData);
		// 	storeAddedMember = groupData;
		// } else {
		// 	socket.to(currentRoom).emit("receive_added_group_member", groupData);
		// 	console.log(groupData);
		// 	storeAddedMember = groupData;
		// }

		socket.broadcast.emit("receive_added_group_member", groupData);
		storeAddedMember = groupData;
	});

	socket.on("send_removed_group_member", (groupData) => {
		if (Object.keys(groupData).length === 0) return;
		// console.log(groupData);

		socket.broadcast.emit("receive_removed_group_member", groupData);
		storeRemovedMember = groupData;
	});

	socket.on("send_group_name_updated", (groupData) => {
		if (Object.keys(groupData).length === 0) return;

		socket.broadcast.emit("receive_group_name_updated", groupData);
		storeGroupNameData = groupData;
	});

	socket.on("send_group_icon_updated", (groupData) => {
		if (Object.keys(groupData).length === 0) return;

		socket.broadcast.emit("receive_group_icon_updated", groupData);
		storeGroupIconData = groupData;
	});

	socket.on("send_group_deleted", (groupData) => {
		if (Object.keys(groupData).length === 0) return;

		socket.broadcast.emit("receive_group_deleted", groupData);
		storeDeletedGroupData = groupData;
	});

	socket.on("disconnect", () => {
		console.log(`A user disconnected ${socket.id}`.brightRed.underline);
	});
});

server.listen(port, () => {
	console.log(`Server started on port: ${port}`.brightWhite);
});

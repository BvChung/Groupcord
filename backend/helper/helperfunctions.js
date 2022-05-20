const jwt = require("jsonwebtoken");

// JWT Token functions -------------------------------

const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: "1d",
	});
};

const generateRefreshToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "1d",
	});
};

// Socket Io functions -------------------------------

// get last room from socket.rooms (socket.rooms = Set object)
const getPreviousRoom = (rooms) => {
	if (rooms.size > 1) {
		let output;
		for (output of rooms);
		return output;
	}
};

const createUser = (connectedUsers, socketId, username, userId) => {
	const newUser = {
		socketId: socketId,
		username: username,
		userId: userId,
	};

	connectedUsers = connectedUsers.filter((user) => {
		return user.username !== newUser.username;
	});

	return [...connectedUsers, newUser];
};

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	getPreviousRoom,
	createUser,
};

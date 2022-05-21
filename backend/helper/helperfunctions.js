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
	getPreviousRoom,
	createUser,
};

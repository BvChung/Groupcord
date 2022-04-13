// get last room from socket.rooms => a Set
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

// const removeUser = (socketId) => {
// 	return (users = users.filter((user) => {
// 		user.socketId !== socketId;
// 	}));
// };

// const createUser = (socketId, username, userId) => {
// 	const newUser = {
// 		socketId: socketId,
// 		username: username,
// 		userId: userId,
// 	};

// 	users = users.filter((user) => {
// 		return user.username !== newUser.username;
// 	});

// 	users.push(newUser);
// };

module.exports = {
	getPreviousRoom,
	createUser,
};

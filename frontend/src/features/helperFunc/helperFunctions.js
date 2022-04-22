import { current } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

export const addMessageDateHistory = (payload) => {
	const messageGroupedByDate = payload.reduce((dateCreated, message) => {
		const date = message.createdAt.split("T")[0];
		if (!dateCreated[date]) {
			dateCreated[date] = [];
		}
		dateCreated[date].push(message);
		return dateCreated;
	}, {});

	const messagesWithDateHistory = Object.values(messageGroupedByDate).reduce(
		(acc, msgArr) => {
			return acc.concat([
				{
					_id: nanoid(),
					type: "renderNewDay",
					user: msgArr[0].user,
					username: msgArr[0].username,
					groupId: msgArr[0].groupId,
					message: msgArr[0].message,
					fullDate: msgArr[0].fullDate,
					timeCreated: msgArr[0].timeCreated,
					dateCreated: msgArr[0].dateCreated,
					createdAt: msgArr[0].createdAt,
				},
				...msgArr,
			]);
		},
		[]
	);

	return messagesWithDateHistory;
};

export const updateGroup = (state, currentGroup, payload) => {
	return current(state).map((data) => {
		if (data._id === currentGroup.groupId) {
			return {
				...payload,
			};
		} else {
			return {
				...data,
			};
		}
	});
};

export const updateGroupName = (state, payload) => {
	return current(state).map((data) => {
		if (data._id === payload._id) {
			return {
				...payload,
			};
		} else {
			return {
				...data,
			};
		}
	});
};

export const updateMembersGroups = (state, payload) => {
	const { groupData, action } = payload;

	const foundChatGroup = current(state).some(
		(data) => data._id === groupData._id
	);

	if (foundChatGroup && action === "removeMember") {
		return current(state).filter((data) => {
			return data._id !== groupData._id;
		});
	} else {
		return [...current(state), groupData];
	}
};

export const filterMembers = (arr1, arr2) => {
	const output = arr1.filter((el1) => {
		return !arr2.find((el2) => {
			return el2._id === el1._id;
		});
	});
	return output;
};

export const filterDuplicateMessages = (messages) => {
	return messages.filter(
		(message, i, arr) =>
			i === arr.findIndex((position) => position._id === message._id)
	);
};

export const deleteData = (state, payload) => {
	return current(state).filter((data) => {
		return data._id !== payload._id;
	});
};

export const configuration = (token) => {
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

export const errorMessage = (error) => {
	const message =
		(error.response && error.response.data && error.response.data.message) ||
		error.message ||
		error.toString();
	return message;
};

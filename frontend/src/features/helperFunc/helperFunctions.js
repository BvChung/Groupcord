import { current } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const timeNow = new Date();
const currentDateFull = timeNow.toLocaleString("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

export const addDateLabelToNewMessages = (state, payload) => {
	const findDateLabel = current(state).some((msg) => {
		return msg.fullDate === currentDateFull;
	});

	// Add date label if
	// 1) Is new group
	// 2) If date label for today is not present
	if (current(state).length === 0) {
		return [
			{
				_id: nanoid(),
				id: payload._id,
				type: "renderNewDay",
				fullDate: currentDateFull,
			},
			payload,
		];
	} else if (!findDateLabel) {
		return [
			...current(state),
			{
				_id: nanoid(),
				id: payload._id,
				type: "renderNewDay",
				fullDate: currentDateFull,
			},
			payload,
		];
	} else {
		return [...current(state), payload];
	}
};

export const createDateLabelForDatabaseMessages = (payload) => {
	const groupMessagesByDate = payload.reduce((dateCreated, message) => {
		const date = message.fullDate;
		if (!dateCreated[date]) {
			dateCreated[date] = [];
		}
		dateCreated[date].push(message);
		return dateCreated;
	}, {});

	const messagesWithDateLabel = Object.values(groupMessagesByDate).reduce(
		(accumulator, msgArrData) => {
			return accumulator.concat([
				{
					_id: nanoid(),
					id: msgArrData[0]._id,
					type: "renderNewDay",
					fullDate: msgArrData[0].fullDate,
				},
				...msgArrData,
			]);
		},
		[]
	);

	return messagesWithDateLabel;
};

export const updateGroupData = (state, currentGroup, payload) => {
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

export const removeDuplicateData = (messages) => {
	return messages.filter(
		(message, i, arr) =>
			i === arr.findIndex((position) => position._id === message._id)
	);
};

export const deleteData = (state, payload) => {
	return current(state).filter((data) => {
		// Remove date label if last message of that date is deleted
		if (data.id === payload._id) {
			return data.id !== payload._id;
		}

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

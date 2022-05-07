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
	// Use reduce method to group messages in object with key => date and value => message arr
	const groupMessagesByDate = payload.reduce((dateCreated, message) => {
		const date = message.fullDate;
		if (!dateCreated[date]) {
			dateCreated[date] = [];
		}
		dateCreated[date].push(message);
		return dateCreated;
	}, {});

	// Reduce method to concatenate all messages and provide the date
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

export const addAndRemoveMembersFromGroups = (state, payload) => {
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

export const availableUsersToAddToGroup = (arr1, arr2) => {
	const output = arr1.filter((el1) => {
		return !arr2.find((el2) => {
			return el2._id === el1._id;
		});
	});
	return output;
};

export const removeDuplicateData = (data) => {
	return data.filter(
		(el, i, arr) => i === arr.findIndex((position) => position._id === el._id)
	);
};

export const deleteMessageData = (state, payload) => {
	return current(state).filter((data, i, arr) => {
		// 1) Method to prevent 2 filters to remove date label
		// 2) Fixes bug where deleting the message sequentially following the date label
		// will delete both the msg and label
		// 3) This method allows for the deletion of messages/labels to be quicker, 2 filters => slows process

		// Remove date label for older messages
		// Use i + 2 b/c i + 1 will be the message from the payload that is deleted when returned
		// Older messages will have the element at i + 2 => condition met
		if (
			data.type === "renderNewDay" &&
			data.fullDate === payload.fullDate &&
			arr[i + 2]
		) {
			if (
				arr[i + 1]._id === payload._id &&
				arr[i + 2].fullDate !== data.fullDate
			) {
				return (
					data.fullDate !== payload.fullDate && data.type === "renderNewDay"
				);
			}
		}

		// New messages sent on the current day (today)
		// Remove date label if last message of that date is deleted therefore i + 2 => undefined
		if (
			data.type === "renderNewDay" &&
			data.fullDate === currentDateFull &&
			arr[i + 1]._id === payload._id &&
			typeof arr[i + 2] === "undefined"
		) {
			return data.fullDate !== payload.fullDate && data.type === "renderNewDay";
		}

		// Removes deleted message from payload
		return data._id !== payload._id;
	});
};

export const deleteGroupData = (state, payload) => {
	return current(state).filter((data) => {
		return data._id !== payload._id;
	});
};

export const configuration = (token) => {
	// JWT Token
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

import { current } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

const timeNow = new Date();
const currentDateFull = timeNow.toLocaleString("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

export const updateUsername = (state, payload) => {
	return current(state).map((msg) => {
		if (msg.user === payload._id) {
			return {
				...msg,
				username: payload.username,
			};
		} else {
			return {
				...msg,
			};
		}
	});
};

export const updateAvatar = (state, payload) => {
	return current(state).map((msg) => {
		if (msg.user === payload._id) {
			return {
				...msg,
				userAvatar: payload.userAvatar,
			};
		} else {
			return {
				...msg,
			};
		}
	});
};

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
				type: "newDateLabel",
				fullDate: currentDateFull,
			},
			payload,
		];
	} else if (!findDateLabel) {
		return [
			...current(state),
			{
				_id: nanoid(),
				type: "newDateLabel",
				fullDate: currentDateFull,
			},
			payload,
		];
	} else {
		return [...current(state), payload];
	}
};

export const createDateLabelForDatabaseMessages = (payload) => {
	// Use reduce method to group messages in Object {date: [messages with same date]}
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
					type: "newDateLabel",
					fullDate: msgArrData[0].fullDate,
				},
				...msgArrData,
			]);
		},
		[]
	);

	return messagesWithDateLabel;
};

export const deleteMessageData = (state, payload) => {
	return current(state).filter((data, i, arr) => {
		// 1) Method to prevent 2 filters to remove date label
		// 2) Fixes bug where deleting the message sequentially following the date label
		// will delete both the message and label
		// 3) This method allows for the deletion of messages/labels to be quicker, 2 filters => slows process

		// Remove date label for older messages
		// Use i + 2 b/c i + 1 will be the message from the payload that is deleted when returned
		// Older messages will have the element at i + 2 => condition met
		if (
			data.type === "newDateLabel" &&
			data.fullDate === payload.fullDate &&
			arr[i + 2]
		) {
			if (
				arr[i + 1]._id === payload._id &&
				arr[i + 2].fullDate !== data.fullDate
			) {
				return (
					data.fullDate !== payload.fullDate && data.type === "newDateLabel"
				);
			}
		}

		// New messages sent on the current day (today)
		// arr[i + 1] = message being removed
		// Remove date label if last message of that date is deleted therefore i + 2 => undefined
		if (
			data.type === "newDateLabel" &&
			data.fullDate === currentDateFull &&
			arr[i + 1]._id === payload._id &&
			typeof arr[i + 2] === "undefined"
		) {
			return data.fullDate !== payload.fullDate && data.type === "newDateLabel";
		}

		// Removes deleted message from payload
		return data._id !== payload._id;
	});
};

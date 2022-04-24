import { nanoid } from "@reduxjs/toolkit";

export const addMessageDateHistory = (payload) => {
	const groupMessagesByDate = payload.reduce((dateCreated, message) => {
		const date = message.fullDate;
		if (!dateCreated[date]) {
			dateCreated[date] = [];
		}
		dateCreated[date].push(message);
		return dateCreated;
	}, {});

	const messagesWithDateHistory = Object.values(groupMessagesByDate).reduce(
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

	return messagesWithDateHistory;
};

import { current } from "@reduxjs/toolkit";

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

export const updateMembersGroups = (obj1, obj2) => {
	const foundChatGroup = current(obj1).some((data) => data._id === obj2._id);

	if (foundChatGroup) {
		return current(obj1).map((data) => {
			if (data._id === obj2._id) {
				return {
					...data,
					members: obj2.members,
					membersId: obj2.membersId,
					createdAt: obj2.createdAt,
					updatedAt: obj2.updatedAt,
				};
			} else {
				return {
					...data,
				};
			}
		});
	} else {
		return [...current(obj1), obj2];
	}
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

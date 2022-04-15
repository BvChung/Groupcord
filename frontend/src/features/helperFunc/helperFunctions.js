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

export const deleteData = (state, payload) => {
	return current(state).filter((data) => {
		return data._id !== payload._id;
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

	// if (foundChatGroup) {
	// 	return current(state).map((data) => {
	// 		if (data._id === groupData._id) {
	// 			return {
	// 				...data,
	// 				members: groupData.members,
	// 				membersId: groupData.membersId,
	// 				createdAt: groupData.createdAt,
	// 				updatedAt: groupData.updatedAt,
	// 			};
	// 		} else {
	// 			return {
	// 				...data,
	// 			};
	// 		}
	// 	});
	// } else {
	// 	return [...current(state), groupData];
	// }
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

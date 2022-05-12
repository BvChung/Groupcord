import { current } from "@reduxjs/toolkit";

export const updateGroupData = (state, currentGroup, payload) => {
	const currentGroupInfoState = current(currentGroup);

	return current(state).map((data) => {
		if (data._id === currentGroupInfoState.groupId) {
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

export const deleteGroupData = (state, payload) => {
	return current(state).filter((data) => {
		return data._id !== payload._id;
	});
};

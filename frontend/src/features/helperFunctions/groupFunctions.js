import { current } from "@reduxjs/toolkit";

export const updateData = (state, payload) => {
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

export const findGroupData = (state, payload) => {
	const currentGroup = payload.find((groupData) => {
		return groupData._id === current(state).groupId;
	});

	return currentGroup.members;
};

export const addMemberToGroup = (state, payload) => {
	const { groupData } = payload;

	return [...current(state), groupData];
};

export const removeMemberFromGroup = (state, payload) => {
	const { groupData } = payload;

	return current(state).filter((data) => {
		return data._id !== groupData._id;
	});
};

export const filterUsers = (arr1, arr2) => {
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

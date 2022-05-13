import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import groupService from "./groupService";
import {
	errorMessage,
	removeDuplicateData,
} from "../helperFunctions/helperFunctions";
import {
	filterUsers,
	updateGroupData,
	addAndRemoveMembersFromGroups,
	removeMemberFromGroup,
	updateGroupName,
	deleteGroupData,
} from "../helperFunctions/groupFunctions";

const initialState = {
	registeredMembers: {},
	groups: {},
	activeGroupInfo: {
		groupId: "Global",
		groupOwner: "",
		members: [],
	},
	membersAvailableToAddToGroup: {},
	memberUpdatedToSocket: {},
	joinedMemberToSocket: {},
	removedMemberToSocket: {},
	groupDeletedToSocket: {},
	updatedGroupNameToSocket: {},
	isLoading: false,
	isSuccess: false,
	loadInitialGroups: false,
	isError: false,
};

export const createChatGroups = createAsyncThunk(
	"group/create",
	async (groupData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await groupService.createGroup(groupData, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getChatGroups = createAsyncThunk(
	"group/get",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await groupService.getGroup(token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateChatGroupName = createAsyncThunk(
	"group/updateGroupName",
	async (groupData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			const { groupId, groupName } = groupData;
			return await groupService.updateGroup(groupId, groupName, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const deleteChatGroup = createAsyncThunk(
	"group/delete",
	async (groupId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await groupService.deleteGroup(groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getRegisteredMembers = createAsyncThunk(
	"group/getMembers",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await groupService.getMembers(token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const addGroupMembers = createAsyncThunk(
	"group/addMembers",
	async (memberId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.activeGroupInfo;
			return await groupService.addMembers(memberId, groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const removeGroupMembers = createAsyncThunk(
	"group/removeMembers",
	async (memberId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.activeGroupInfo;
			return await groupService.removeMembers(memberId, groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const groupSlice = createSlice({
	name: "chatGroup",
	initialState,
	reducers: {
		resetGroupState: (state) => initialState,
		updateActiveGroup: (state, action) => {
			state.activeGroupInfo = action.payload;
			state.membersAvailableToAddToGroup = filterUsers(
				state.registeredMembers,
				state.activeGroupInfo.members
			);
		},
		leaveGroup: (state, action) => {
			state.groups = deleteGroupData(state.groups, action.payload);
		},
		socketDataUpdateMembers: (state, action) => {
			console.log("update members");
			state.activeGroupInfo.members = action.payload.groupData.members;
			state.membersAvailableToAddToGroup =
				action.payload.membersAvailableToAddToGroup;
		},
		socketDataUpdateGroups: (state, action) => {
			console.log("update group");
			state.groups = addAndRemoveMembersFromGroups(
				state.groups,
				action.payload
			);
			state.groups = removeDuplicateData(state.groups);
		},
		socketDataUpdateGroupForMember: (state, action) => {
			console.log("update group");
			state.groups = addAndRemoveMembersFromGroups(
				state.groups,
				action.payload
			);
			state.groups = removeDuplicateData(state.groups);
		},
		// -----
		socketDataAddGroupForMember: (state, action) => {
			console.log("update group");
			state.groups = [...state.groups, action.payload];
		},
		socketDataRemoveGroupForMember: (state, action) => {
			console.log("update group");
			state.groups = removeMemberFromGroup(state.groups, action.payload);
		},
		socketDataUpdateGroupName: (state, action) => {
			state.groups = updateGroupName(state.groups, action.payload);
		},
		socketDataDeleteGroup: (state, action) => {
			state.groups = deleteGroupData(state.groups, action.payload);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(createChatGroups.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(createChatGroups.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.groups.push(action.payload);
		});
		builder.addCase(createChatGroups.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(getChatGroups.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getChatGroups.fulfilled, (state, action) => {
			state.isLoading = false;
			state.loadInitialGroups = true;
			state.groups = action.payload.userConversations;
		});
		builder.addCase(getChatGroups.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(deleteChatGroup.fulfilled, (state, action) => {
			state.groups = action.payload.allGroups;
			state.groupDeletedToSocket = action.payload.deletedGroup;
		});
		builder.addCase(addGroupMembers.fulfilled, (state, action) => {
			state.isSuccess = true;
			console.log(action.payload);
			// Update current group info
			state.activeGroupInfo.members = action.payload.updatedMembers.members;

			// Update groups
			state.groups = updateGroupData(
				state.groups,
				state.activeGroupInfo,
				action.payload.updatedMembers
			);

			state.membersAvailableToAddToGroup = filterUsers(
				state.registeredMembers,
				state.activeGroupInfo.members
			);

			state.memberUpdatedToSocket = {
				groupData: action.payload.updatedMembers,
				memberChanged: action.payload.memberChanged,
				action: "addMember",
			};
			state.joinedMemberToSocket = {
				groupData: action.payload.updatedMembers,
				memberChanged: action.payload.memberChanged,
				action: "addMember",
			};
		});
		builder.addCase(removeGroupMembers.fulfilled, (state, action) => {
			state.isSuccess = true;
			state.activeGroupInfo.members = action.payload.updatedMembers.members;

			state.groups = updateGroupData(
				state.groups,
				state.activeGroupInfo,
				action.payload.updatedMembers
			);

			state.membersAvailableToAddToGroup = filterUsers(
				state.registeredMembers,
				state.activeGroupInfo.members
			);

			state.memberUpdatedToSocket = {
				groupData: action.payload.updatedMembers,
				memberChanged: action.payload.memberChanged,
				membersAvailableToAddToGroup: [
					...state.membersAvailableToAddToGroup,
					action.payload.memberChanged,
				],
				action: "removeMember",
			};
			state.removedMemberToSocket = {
				groupData: action.payload.updatedMembers,
				memberChanged: action.payload.memberChanged,
				membersAvailableToAddToGroup: [
					...state.membersAvailableToAddToGroup,
					action.payload.memberChanged,
				],
				action: "removeMember",
			};
		});
		builder.addCase(getRegisteredMembers.fulfilled, (state, action) => {
			state.registeredMembers = action.payload;
		});
		builder.addCase(updateChatGroupName.fulfilled, (state, action) => {
			state.groups = action.payload.allGroups;
			state.updatedGroupNameToSocket = action.payload.updatedGroupName;
		});
	},
});

export const {
	resetGroupState,
	leaveGroup,
	socketDataUpdateMembers,
	updateActiveGroup,
	socketDataUpdateGroups,
	socketDataUpdateGroupName,
	socketDataDeleteGroup,
} = groupSlice.actions;
export default groupSlice.reducer;

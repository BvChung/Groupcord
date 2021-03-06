import {
	createAsyncThunk,
	createSlice,
	current,
	nanoid,
} from "@reduxjs/toolkit";
import groupService from "./groupService";
import { errorMessage } from "../helperFunctions/helperFunctions";
import {
	filterUsers,
	updateData,
	removeMemberFromGroup,
	deleteGroupData,
} from "../helperFunctions/groupFunctions";

const initialState = {
	groups: {},
	activeGroupInfo: {
		groupId: "Global",
		groupName: "",
		groupOwner: "",
		members: [],
	},
	registeredMembers: {},
	membersAvailableToAddToGroup: {},
	addedMemberToSocket: {},
	removedMemberToSocket: {},
	groupDeletedToSocket: {},
	updatedGroupNameToSocket: {},
	updatedGroupIconToSocket: {},
	hideGroupMemberDisplay: false,
	isLoading: false,
	updatingGroupSettings: false,
	loadingGroups: false,
	loadCompleted: false,
	isSuccess: false,
	isError: false,
	errorMessage: "",
};

export const createChatGroups = createAsyncThunk(
	"group/create",
	async (groupData, thunkAPI) => {
		try {
			return await groupService.createGroup(groupData);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getChatGroups = createAsyncThunk(
	"group/get",
	async (_, thunkAPI) => {
		try {
			return await groupService.getGroup();
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateChatGroupName = createAsyncThunk(
	"group/updateGroupName",
	async (groupData, thunkAPI) => {
		try {
			const { groupId, groupName } = groupData;
			return await groupService.updateName(groupId, groupName);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateChatGroupIcon = createAsyncThunk(
	"group/updateGroupIcon",
	async (groupData, thunkAPI) => {
		try {
			const { groupId, file } = groupData;
			return await groupService.updateIcon(groupId, file);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const deleteChatGroup = createAsyncThunk(
	"group/delete",
	async (groupId, thunkAPI) => {
		try {
			return await groupService.deleteGroup(groupId);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getRegisteredMembers = createAsyncThunk(
	"group/getMembers",
	async (_, thunkAPI) => {
		try {
			return await groupService.getMembers();
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const addGroupMembers = createAsyncThunk(
	"group/addMembers",
	async (memberId, thunkAPI) => {
		try {
			const { groupId } = thunkAPI.getState().conversations.activeGroupInfo;
			return await groupService.addMembers(memberId, groupId);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const removeGroupMembers = createAsyncThunk(
	"group/removeMembers",
	async (memberId, thunkAPI) => {
		try {
			const { groupId } = thunkAPI.getState().conversations.activeGroupInfo;
			return await groupService.removeMembers(memberId, groupId);
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
		resetSuccessState: (state) => {
			state.isSuccess = false;
		},
		resetErrorState: (state) => {
			state.isError = false;
			state.errorMessage = "";
		},
		updateActiveGroup: (state, action) => {
			state.activeGroupInfo = action.payload;
		},
		leaveGroup: (state, action) => {
			state.groups = deleteGroupData(state.groups, action.payload);
		},
		hideGroupMemberDisplay: (state) => {
			state.hideGroupMemberDisplay = true;
		},
		resetGroupMemberDisplay: (state) => {
			if (state.hideGroupMemberDisplay) {
				state.hideGroupMemberDisplay = false;
			}
		},
		socketDataUpdateMembers: (state, action) => {
			state.activeGroupInfo.members = action.payload.groupData.members;
		},
		socketDataUpdateMembersPersonalInfo: (state, action) => {
			state.activeGroupInfo.members = updateData(
				state.activeGroupInfo.members,
				action.payload
			);
		},
		socketDataAddGroupForMember: (state, action) => {
			state.groups = [...current(state.groups), action.payload.groupData];
		},
		socketDataRemoveGroupForMember: (state, action) => {
			state.groups = removeMemberFromGroup(state.groups, action.payload);
		},
		socketDataUpdateGroupName: (state, action) => {
			state.groups = updateData(state.groups, action.payload);
		},
		socketDataUpdateGroupIcon: (state, action) => {
			state.groups = updateData(state.groups, action.payload);
		},
		socketDataDeleteGroup: (state, action) => {
			state.groups = deleteGroupData(state.groups, action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getChatGroups.pending, (state) => {
				state.loadingGroups = true;
				state.loadCompleted = false;
			})
			.addCase(getChatGroups.fulfilled, (state, action) => {
				state.loadingGroups = false;
				state.loadCompleted = true;
				state.groups = action.payload;
			})
			.addCase(getChatGroups.rejected, (state, action) => {
				state.loadingGroups = false;
				state.isError = true;
				if (!action.payload.includes("accessToken")) {
					state.errorMessage = action.payload;
				}
			})
			.addCase(createChatGroups.fulfilled, (state, action) => {
				state.isLoading = false;
				state.groups.push(action.payload);
			})
			.addCase(createChatGroups.rejected, (state) => {
				state.isLoading = false;
				state.isError = true;
			})
			.addCase(deleteChatGroup.fulfilled, (state, action) => {
				state.isSuccess = true;
				state.groups = action.payload.allGroups;
				state.groupDeletedToSocket = action.payload.deletedGroup;
			})
			.addCase(getRegisteredMembers.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getRegisteredMembers.fulfilled, (state, action) => {
				state.isLoading = false;

				state.registeredMembers = action.payload;

				state.membersAvailableToAddToGroup = filterUsers(
					state.registeredMembers,
					state.activeGroupInfo.members
				);
			})
			.addCase(addGroupMembers.fulfilled, (state, action) => {
				// Update current group info
				state.activeGroupInfo.members = action.payload.updatedMembers.members;

				// Update groups
				state.groups = updateData(state.groups, action.payload.updatedMembers);

				state.membersAvailableToAddToGroup = filterUsers(
					state.registeredMembers,
					state.activeGroupInfo.members
				);

				state.addedMemberToSocket = {
					id: nanoid(),
					groupData: action.payload.updatedMembers,
					memberChanged: action.payload.memberChanged,
				};
			})
			.addCase(removeGroupMembers.fulfilled, (state, action) => {
				state.activeGroupInfo.members = action.payload.updatedMembers.members;

				state.groups = updateData(state.groups, action.payload.updatedMembers);

				state.removedMemberToSocket = {
					id: nanoid(),
					groupData: action.payload.updatedMembers,
					memberChanged: action.payload.memberChanged,
				};
			})
			.addCase(updateChatGroupName.pending, (state) => {
				state.updatingGroupSettings = true;
			})
			.addCase(updateChatGroupName.fulfilled, (state, action) => {
				state.updatingGroupSettings = false;
				state.isSuccess = true;

				state.activeGroupInfo.groupName =
					action.payload.updatedGroupName.groupName;
				state.groups = action.payload.allGroups;
				state.updatedGroupNameToSocket = action.payload.updatedGroupName;
			})
			.addCase(updateChatGroupName.rejected, (state, action) => {
				state.updatingGroupSettings = false;
				state.isError = true;

				// Prevent display of invalid access JWT
				if (!action.payload.includes("accessToken")) {
					state.errorMessage = action.payload;
				}
			})
			.addCase(updateChatGroupIcon.pending, (state) => {
				state.updatingGroupSettings = true;
			})
			.addCase(updateChatGroupIcon.fulfilled, (state, action) => {
				state.updatingGroupSettings = false;
				state.isSuccess = true;

				state.groups = updateData(state.groups, action.payload);
				state.updatedGroupIconToSocket = action.payload;
			})
			.addCase(updateChatGroupIcon.rejected, (state, action) => {
				state.updatingGroupSettings = false;
				state.isError = true;

				// Prevent display of invalid access JWT
				if (!action.payload.includes("accessToken")) {
					state.errorMessage = action.payload;
				}
			});
	},
});

export const {
	resetGroupState,
	resetSuccessState,
	resetErrorState,
	leaveGroup,
	hideGroupMemberDisplay,
	resetGroupMemberDisplay,
	updateActiveGroup,
	socketDataUpdateMembers,
	socketDataUpdateMembersPersonalInfo,
	socketDataUpdateGroups,
	socketDataAddGroupForMember,
	socketDataRemoveGroupForMember,
	socketDataUpdateGroupName,
	socketDataUpdateGroupIcon,
	socketDataDeleteGroup,
} = groupSlice.actions;
export default groupSlice.reducer;

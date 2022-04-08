import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import conversationService from "./conversationService";
import { filterMembers, errorMessage } from "../helperFunctions";

const initialState = {
	registeredMembers: {},
	groups: {},
	groupInfo: {
		groupId: "Global",
	},
	filteredMembers: {},
	isLoading: false,
	isSuccess: false,
	isError: false,
};

export const createChatConversations = createAsyncThunk(
	"conversation/create",
	async (conversationData, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await conversationService.createConversation(
				conversationData,
				token
			);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getChatGroups = createAsyncThunk(
	"conversation/get",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await conversationService.getConversation(token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const getAvailableMembers = createAsyncThunk(
	"group/getMembers",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await conversationService.getMembers(token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateGroupMembers = createAsyncThunk(
	"group/members",
	async (memberId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.groupInfo;
			return await conversationService.addMembers(memberId, groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateActiveChatGroup = createAsyncThunk(
	"group/active",
	async (groupInfo) => {
		try {
			// maybe send object
			return groupInfo;
		} catch (error) {
			console.error(error);
		}
	}
);

export const conversationSlice = createSlice({
	name: "conversation",
	initialState,
	reducers: {
		resetGroupState: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder.addCase(createChatConversations.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(createChatConversations.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.groups.allConversations.push(action.payload);
		});
		builder.addCase(createChatConversations.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(getChatGroups.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getChatGroups.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.groups = action.payload;
		});
		builder.addCase(getChatGroups.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(updateGroupMembers.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateGroupMembers.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			console.log(action.payload);
		});
		builder.addCase(updateGroupMembers.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
		builder.addCase(getAvailableMembers.fulfilled, (state, action) => {
			state.registeredMembers = action.payload;
		});
		builder.addCase(updateActiveChatGroup.fulfilled, (state, action) => {
			state.groupInfo = action.payload;
			// console.log(`Action payload:`, action.payload);

			state.filteredMembers = filterMembers(
				state.registeredMembers,
				state.groupInfo.members
			);
		});
	},
});

export const { resetGroupState } = conversationSlice.actions;
export default conversationSlice.reducer;

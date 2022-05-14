import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "./messageService";
import { errorMessage } from "../helperFunctions/helperFunctions";
import {
	deleteMessageData,
	addDateLabelToNewMessages,
	createDateLabelForDatabaseMessages,
	updateAvatar,
	updateUsername,
} from "../helperFunctions/messageFunctions";

const initialState = {
	userMessages: {},
	newMessageToSocket: {},
	deletedMessageToSocket: {},
	hideTextInput: false,
	isLoading: false,
	loadInitialMessages: false,
	isSuccess: false,
	isError: false,
	expiredJSONWebToken: false,
	errorMessage: "",
};

export const getChatMessage = createAsyncThunk(
	"message/getAll",
	async (_, thunkAPI) => {
		try {
			// thunkAPI has a method to get any state value from the redux store
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.activeGroupInfo;
			return await chatService.getMessage(groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const createChatMessage = createAsyncThunk(
	"message/create",
	async (messageData, thunkAPI) => {
		try {
			// thunkAPI has a method to get any state value from the redux store
			const token = thunkAPI.getState().auth.user.token;
			return await chatService.createMessage(messageData, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const deleteChatMessage = createAsyncThunk(
	"message/delete",
	async (messageId, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await chatService.deleteMessage(messageId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {
		resetMessageState: (state) => initialState,
		hideTextInput: (state) => {
			state.hideTextInput = true;
		},
		resetTextInput: (state) => {
			if (state.hideTextInput) {
				state.hideTextInput = false;
			}
		},
		clearChatMessages: (state) => {
			state.userMessages.groupMessages = [];
		},
		socketDataUpdateMessageUsername: (state, action) => {
			state.userMessages.groupMessages = updateUsername(
				state.userMessages.groupMessages,
				action.payload
			);
		},
		socketDataUpdateMessageAvatar: (state, action) => {
			state.userMessages.groupMessages = updateAvatar(
				state.userMessages.groupMessages,
				action.payload
			);
		},
		socketDataAddMessage: (state, action) => {
			console.log("new message");
			state.userMessages.groupMessages = addDateLabelToNewMessages(
				state.userMessages.groupMessages,
				action.payload
			);
		},
		socketDataRemoveDeletedMessage: (state, action) => {
			state.userMessages.groupMessages = deleteMessageData(
				state.userMessages.groupMessages,
				action.payload
			);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(createChatMessage.pending, (state) => {
			state.isLoading = true;
			state.newMessageToSocket = {};
		});
		builder.addCase(createChatMessage.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.userMessages.groupMessages = addDateLabelToNewMessages(
				state.userMessages.groupMessages,
				action.payload
			);
			state.newMessageToSocket = action.payload;
		});
		builder.addCase(createChatMessage.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		});
		builder.addCase(getChatMessage.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getChatMessage.fulfilled, (state, action) => {
			state.isLoading = false;
			state.loadInitialMessages = true;
			state.userMessages = action.payload;
			state.userMessages.groupMessages = createDateLabelForDatabaseMessages(
				action.payload.groupMessages
			);
		});
		builder.addCase(getChatMessage.rejected, (state, action) => {
			state.isLoading = false;
			state.expiredJSONWebToken = true;
			state.errorMessage = action.payload;
		});
		builder.addCase(deleteChatMessage.fulfilled, (state, action) => {
			state.userMessages.groupMessages = deleteMessageData(
				state.userMessages.groupMessages,
				action.payload
			);
			state.deletedMessageToSocket = action.payload;
		});
	},
});

export const {
	resetMessageState,
	clearChatMessages,
	hideTextInput,
	resetTextInput,
	socketDataUpdateMessageUsername,
	socketDataUpdateMessageAvatar,
	socketDataAddMessage,
	socketDataRemoveDeletedMessage,
} = messageSlice.actions;
export default messageSlice.reducer;

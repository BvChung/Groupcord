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
	loadInitialMessages: false,
	hideTextInput: false,
	isLoading: false,
	isSuccess: false,
	isError: false,
	errorMessage: "",
};

export const getChatMessage = createAsyncThunk(
	"message/get",
	async (_, thunkAPI) => {
		try {
			const { groupId } = thunkAPI.getState().conversations.activeGroupInfo;
			return await chatService.getMessage(groupId);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const createChatMessage = createAsyncThunk(
	"message/create",
	async (messageData, thunkAPI) => {
		try {
			return await chatService.createMessage(messageData);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const deleteChatMessage = createAsyncThunk(
	"message/delete",
	async (messageId, thunkAPI) => {
		try {
			return await chatService.deleteMessage(messageId);
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
		clearNewMessageSocketData: (state) => {
			state.newMessageToSocket = {};
		},
		clearDeletedMessageSocketData: (state) => {
			state.deletedMessageToSocket = {};
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
			state.newMessageToSocket = {};
		});
		builder.addCase(createChatMessage.fulfilled, (state, action) => {
			state.isSuccess = true;
			state.userMessages.groupMessages = addDateLabelToNewMessages(
				state.userMessages.groupMessages,
				action.payload
			);
			state.newMessageToSocket = action.payload;
		});
		builder.addCase(createChatMessage.rejected, (state, action) => {
			state.isError = true;
			state.errorMessage = action.payload;
		});
		builder.addCase(getChatMessage.pending, (state) => {
			state.isLoading = true;
			state.loadInitialMessages = false;
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
	clearNewMessageSocketData,
	clearDeletedMessageSocketData,
	hideTextInput,
	resetTextInput,
	socketDataUpdateMessageUsername,
	socketDataUpdateMessageAvatar,
	socketDataAddMessage,
	socketDataRemoveDeletedMessage,
} = messageSlice.actions;
export default messageSlice.reducer;

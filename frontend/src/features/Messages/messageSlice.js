import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "./messageService";
import { errorMessage } from "../helperFunctions";

// Is useState() but for all in redux
const initialState = {
	isLoading: false,
	isSuccess: false,
	isError: false,
	errorMessage: "",
	messageArr: {},
	newMessage: {},
	messageGroup: "Global",
};

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

export const getChatMessage = createAsyncThunk(
	"message/getAll",
	async (_, thunkAPI) => {
		try {
			// thunkAPI has a method to get any state value from the redux store
			const token = thunkAPI.getState().auth.user.token;
			const { groupId } = thunkAPI.getState().conversations.groupInfo;
			// console.log(groupId);
			return await chatService.getMessage(groupId, token);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateChatMessage = createAsyncThunk(
	"message/update",
	async (message) => {
		try {
			return message;
		} catch (error) {
			console.error(error);
		}
	}
);

// export const updateChatGroup = createAsyncThunk(
// 	"message/updateGroup",
// 	async (groupId) => {
// 		try {
// 			console.log(`To backend:`, groupId);
// 			return groupId;
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	}
// );

// builder.addCase(updateChatMessage.rejected, (state, action) => {
// 	state.isError = true;
// 	state.errorMessage = action.payload;
// });

export const messageSlice = createSlice({
	name: "message",
	initialState,
	reducers: {
		resetMessageState: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder.addCase(createChatMessage.pending, (state) => {
			state.isLoading = true;
			state.newMessage = {};
		});
		builder.addCase(createChatMessage.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			// state.messageArr.allMessages.push(action.payload);
			state.messageArr.groupMessages.push(action.payload);
			state.newMessage = action.payload;
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
			state.isSuccess = true;
			state.messageArr = action.payload;
		});
		builder.addCase(getChatMessage.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		});
		builder.addCase(updateChatMessage.fulfilled, (state, action) => {
			state.messageArr.allMessages.push(action.payload);
		});
	},
});

export const { resetMessageState } = messageSlice.actions;
export default messageSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import conversationService from "./conversationService";

const initialState = {
	groupName: "",
	receiverName: "",
	groups: {},
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
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const getChatConversations = createAsyncThunk(
	"conversation/get",
	async (_, thunkAPI) => {
		try {
			const token = thunkAPI.getState().auth.user.token;
			return await conversationService.getConversation(token);
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			return thunkAPI.rejectWithValue(message);
		}
	}
);

export const conversationSlice = createSlice({
	name: "conversation",
	initialState,
	reducers: {
		resetState: (state) => initialState,
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
		builder.addCase(getChatConversations.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getChatConversations.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.groups = action.payload;
		});
		builder.addCase(getChatConversations.rejected, (state) => {
			state.isLoading = false;
			state.isError = true;
		});
	},
});

export const { resetState } = conversationSlice.actions;
export default conversationSlice.reducer;

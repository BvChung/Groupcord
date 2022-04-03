import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
	groupName: "",
	receiverName: "",
};

const createConversation = createAsyncThunk(
	"conversation/create",
	async (req, res) => {}
);

const conversationSlice = createSlice({
	name: "conversation",
	initialState,
	reducers: {
		resetState: (state) => initialState,
	},
	extraReducers: (builder) => {},
});

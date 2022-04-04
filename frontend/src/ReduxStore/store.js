import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Authentication/authSlice";
import messagesReducer from "../features/Messages/messageSlice";
import themeReducer from "../features/Theme/themeSlice";
import conversationReducer from "../features/Conversations/conversationSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		conversations: conversationReducer,
		messages: messagesReducer,
		theme: themeReducer,
	},
});

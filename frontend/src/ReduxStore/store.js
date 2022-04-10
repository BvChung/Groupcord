import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authentication/authSlice";
import messagesReducer from "../features/messages/messageSlice";
import themeReducer from "../features/theme/themeSlice";
import conversationReducer from "../features/conversations/conversationSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		conversations: conversationReducer,
		messages: messagesReducer,
		theme: themeReducer,
	},
});

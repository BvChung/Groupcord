import { configureStore, createStore } from "@reduxjs/toolkit";
import authReducer from "../features/authentication/authSlice";
import messagesReducer from "../features/messages/messageSlice";
import themeReducer from "../features/theme/themeSlice";
import groupReducer from "../features/groups/groupSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		conversations: groupReducer,
		messages: messagesReducer,
		theme: themeReducer,
	},
});

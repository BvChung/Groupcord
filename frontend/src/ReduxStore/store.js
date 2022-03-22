import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Authentication/authSlice";
import messagesReducer from "../features/Messages/messageSlice";
import themeReducer from "../features/Theme/themeSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		messages: messagesReducer,
		theme: themeReducer,
	},
});

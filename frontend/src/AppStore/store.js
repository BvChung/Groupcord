import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Authentication/authSlice";
import chatLogReducer from "../features/ChatLog/chatLogSlice";
import themeReducer from "../features/Theme/theme";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		chatLog: chatLogReducer,
		theme: themeReducer,
	},
});

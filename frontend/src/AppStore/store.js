import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/User/userSlice";
import authReducer from "../features/Authentication/authSlice";
import themeReducer from "../features/Theme/theme";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		theme: themeReducer,
	},
});

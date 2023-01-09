import { createSlice } from "@reduxjs/toolkit";

const storedTheme = JSON.parse(localStorage.getItem("groupCordTheme"));

const initialState = { darkMode: storedTheme ? storedTheme : false };

export const themeSlice = createSlice({
	name: "currentTheme",
	initialState,
	reducers: {
		changeTheme: (state) => {
			state.darkMode = !state.darkMode;
			localStorage.setItem("groupCordTheme", JSON.stringify(state.darkMode));
		},
	},
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;

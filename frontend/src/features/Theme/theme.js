import { useEffect } from "react";
import { createSlice } from "@reduxjs/toolkit";

const themeValue = { darkMode: false };

export const themeSlice = createSlice({
	name: "theme",
	initialState: {
		value: themeValue,
	},
	reducers: {
		changeTheme: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;

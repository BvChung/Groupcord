import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { errorMessage } from "../helperFunctions/helperFunctions";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
	user: user ? user : null,
	updatedUsernameToSocket: {},
	updatedAvatarToSocket: {},
	loginError: false,
	registerError: false,
	updateError: false,
	loggedIn: false,
	isSuccess: false,
	changedAvatar: false,
	isLoading: false,
	message: "",
};

// A function that accepts a Redux action type string and a callback function that should return a promise. It generates promise lifecycle action types based on the action type prefix that you pass in,
// and returns a thunk action creator that will run the promise callback
// and dispatch the lifecycle actions based on the returned promise.
// params: createAsyncThunk('action', async(user data from register component, thunkAPI)=> {})

// Login user
export const loginUser = createAsyncThunk(
	"auth/login",
	async (user, thunkAPI) => {
		try {
			return await authService.login(user);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const registerUser = createAsyncThunk(
	"auth/register",
	async (user, thunkAPI) => {
		try {
			return await authService.register(user);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const logoutUser = createAsyncThunk(
	"auth/logout",
	async (_, thunkAPI) => {
		try {
			return await authService.logout();
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const refreshAccessToken = createAsyncThunk(
	"auth/refreshToken",
	async (_, thunkAPI) => {
		try {
			return await authService.refreshToken();
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

// Update Personal Info
export const updateAccountUsername = createAsyncThunk(
	"auth/updateUsername",
	async (userData, thunkAPI) => {
		try {
			const accessToken = thunkAPI.getState().auth.user.accessToken;
			return await authService.updateUsername(userData, accessToken);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateAccountEmail = createAsyncThunk(
	"auth/updateEmail",
	async (userData, thunkAPI) => {
		try {
			const accessToken = thunkAPI.getState().auth.user.accessToken;
			return await authService.updateEmail(userData, accessToken);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateAccountPassword = createAsyncThunk(
	"auth/updatePassword",
	async (userData, thunkAPI) => {
		try {
			const accessToken = thunkAPI.getState().auth.user.accessToken;
			return await authService.updatePassword(userData, accessToken);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const updateAccountAvatar = createAsyncThunk(
	"auth/avatar",
	async (file, thunkAPI) => {
		try {
			const accessToken = thunkAPI.getState().auth.user.accessToken;
			return await authService.updateAvatar(file, accessToken);
		} catch (error) {
			return thunkAPI.rejectWithValue(errorMessage(error));
		}
	}
);

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		resetState: (state) => {
			state.isLoading = false;
			state.isSuccess = false;
			state.registerError = false;
			state.loginError = false;
			state.updateError = false;
			state.message = "";
		},
		resetSuccessNotifications: (state) => {
			state.changedAvatar = false;
		},
	},
	// Create extra reducers for the pending, fulfilled and rejected states
	// Placed in extrareducers since registering uses asyncThunk
	// Extrareducers update the state like function in useState()
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.registerError = true;
				state.message = action.payload;
				state.user = null;
			})
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.loggedIn = true;
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.loginError = true;
				state.message = action.payload;
				state.user = null;
			})
			.addCase(updateAccountAvatar.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
			})
			.addCase(updateAccountAvatar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.changedAvatar = true;
				state.user = action.payload;
				state.updatedAvatarToSocket = {
					_id: action.payload._id,
					username: action.payload.username,
					userAvatar: action.payload.userAvatar,
				};
			})
			.addCase(updateAccountAvatar.rejected, (state, action) => {
				state.isLoading = false;
				state.updateError = true;
				state.message = action.payload;
			})
			.addCase(updateAccountUsername.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
			})
			.addCase(updateAccountUsername.fulfilled, (state, action) => {
				console.log(action.payload);
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
				state.updatedUsernameToSocket = {
					_id: action.payload._id,
					username: action.payload.username,
					userAvatar: action.payload.userAvatar,
				};
			})
			.addCase(updateAccountUsername.rejected, (state, action) => {
				state.isLoading = false;
				state.updateError = true;
				state.message = action.payload;
				console.log(action.payload);
			})
			.addCase(updateAccountEmail.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
			})
			.addCase(updateAccountEmail.fulfilled, (state, action) => {
				console.log(action.payload);
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(updateAccountEmail.rejected, (state, action) => {
				state.isLoading = false;
				state.updateError = true;
				state.message = action.payload;
			})
			.addCase(updateAccountPassword.pending, (state) => {
				state.isLoading = true;
				state.isSuccess = false;
			})
			.addCase(updateAccountPassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(updateAccountPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.updateError = true;
				state.message = action.payload;
			})
			.addCase(refreshAccessToken.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(logoutUser.fulfilled, (state, action) => {
				state.user = null;
				state.loggedIn = false;
				// console.log(action.payload);
			});
	},
});

export const { resetState, resetSuccessNotifications } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { errorMessage } from "../helperFunctions/helperFunctions";

const initialState = {
	user: null,
	loggedIn: false,
	isSuccess: false,
	isLoading: false,
	isError: false,
	errorMessage: "",
	updatedUsernameToSocket: {},
	updatedAvatarToSocket: {},
	expiredRefreshJWT: false,
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
		resetState: (state) => initialState,
		resetJWT: (state) => {
			state.expiredRefreshJWT = false;
		},
		resetSuccessState: (state) => {
			state.isSuccess = false;
		},
		resetErrorState: (state) => {
			state.isError = false;
			state.errorMessage = "";
		},
	},
	// Create extra reducers for the pending, fulfilled and rejected states
	// Placed in extrareducers since registering uses asyncThunk
	// Extrareducers update the state like function in useState()
	extraReducers: (builder) => {
		builder
			.addCase(refreshAccessToken.fulfilled, (state, action) => {
				state.user = { ...state.user, accessToken: action.payload.accessToken };
			})
			.addCase(refreshAccessToken.rejected, (state) => {
				state.expiredRefreshJWT = true;
			})
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.loggedIn = true;
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
				state.user = null;
			})
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.loggedIn = true;
				state.user = action.payload;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
				state.user = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loggedIn = false;
			})
			.addCase(updateAccountUsername.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAccountUsername.fulfilled, (state, action) => {
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
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(updateAccountEmail.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAccountEmail.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(updateAccountEmail.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(updateAccountPassword.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAccountPassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(updateAccountPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			})
			.addCase(updateAccountAvatar.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateAccountAvatar.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
				state.updatedAvatarToSocket = {
					_id: action.payload._id,
					username: action.payload.username,
					userAvatar: action.payload.userAvatar,
				};
			})
			.addCase(updateAccountAvatar.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.errorMessage = action.payload;
			});
	},
});

export const { resetState, resetJWT, resetSuccessState, resetErrorState } =
	authSlice.actions;
export default authSlice.reducer;

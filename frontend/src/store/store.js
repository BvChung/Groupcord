import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../reducers/authentication/authSlice";
import messageReducer from "../reducers/messages/messageSlice";
import themeReducer from "../reducers/theme/themeSlice";
import groupReducer from "../reducers/groups/groupSlice";

const appReducer = combineReducers({
	auth: authReducer,
	conversations: groupReducer,
	messages: messageReducer,
	theme: themeReducer,
});

const persistConfig = {
	key: "root",
	version: 1,
	storage,
	whitelist: ["auth", "conversations"],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export let persistor = persistStore(store);

import axios from "axios";
import { refreshAccessToken } from "../reducers/authentication/authSlice";
const BASE_URL = process.env.REACT_APP_CHAT_API;

// 1) There can be only a single Redux store import per app => *In root of app: index.js
// 2) injectStore() allows this file to have access to the Redux store without causing
// 	a cyclic import dependency issue.
let store;
export const injectStore = (_store) => {
	store = _store;
};

export const axiosPublic = axios.create({
	withCredentials: true,
});
export const axiosPrivate = axios.create({
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

// Edit HTTP Authorization headers of all private req to include access token
axiosPrivate.interceptors.request.use(
	(config) => {
		const { accessToken } = store?.getState()?.auth?.user;

		if (!config.headers["Authorization"]) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(err) => Promise.reject(err)
);

// 1) Access token expired => returns 403
// 2) Refresh JWT http cookie => dispatches to return a new access token
// 3) If refresh token expired => logout user
// 4) If new access token returned => send another request
//    *prevRequest._retry => prevents request from sending more than once
axiosPrivate.interceptors.response.use(
	(response) => response,
	async (err) => {
		const prevRequest = err?.config;

		if (err?.response?.status === 403 && !prevRequest._retry) {
			prevRequest._retry = true;
			const newAccessToken = await store.dispatch(refreshAccessToken());

			prevRequest.headers[
				"Authorization"
			] = `Bearer ${newAccessToken.payload.accessToken}`;

			return axiosPrivate(prevRequest);
		}
		return Promise.reject(err);
	}
);

import axios from "axios";
import { refreshAccessToken } from "../features/authentication/authSlice";
const BASE_URL = "http://localhost:3001";

// 1) There can be only a single Redux store import per app => *In root of app: index.js
// 2) injectStore() allows this file to have access to the Redux store without causing
// 	a cyclic import dependency issue.
let store;
export const injectStore = (_store) => {
	store = _store;
};

export const axiosPublic = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
});
export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

export const requestInterceptor = axiosPrivate.interceptors.request.use(
	(config) => {
		const { accessToken } = store?.getState()?.auth?.user;

		if (!config.headers["Authorization"]) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(err) => Promise.reject(err)
);

export const responseInterceptor = axiosPrivate.interceptors.response.use(
	(response) => response,
	async (err) => {
		const prevRequest = err?.config;
		console.log(prevRequest);

		// If there is a 403 error and the request is sent only once then issue a new access JWT
		// using the refresh JWT cookie
		if (err?.response?.status === 403 && !prevRequest._retry) {
			console.count(!prevRequest._retry);
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

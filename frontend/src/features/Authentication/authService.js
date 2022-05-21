import axios from "axios";
import {
	axiosPublic,
	axiosPrivate,
	requestInterceptor,
	responseInterceptor,
} from "../../api/axios";

const API_URL = "/api/users";

//Use refresh JWT from http cookie to give new access JWT ------------------------
const refreshToken = async () => {
	const response = await axiosPrivate.get("/api/refresh", {
		withCredentials: true,
	});

	// if (response.status === 403) {
	// 	console.log(response);
	// 	axiosPrivate.interceptors.request.eject(requestInterceptor);
	// 	axiosPrivate.interceptors.response.eject(responseInterceptor);
	// }

	if (response.data) {
		const user = JSON.parse(localStorage.getItem("user"));

		const newAccessToken = {
			...user,
			accessToken: response.data.accessToken,
		};

		localStorage.setItem("user", JSON.stringify(newAccessToken));

		return newAccessToken;
	}
};

// Login user ------------------------
const login = async (userData) => {
	const response = await axiosPublic.post(`${API_URL}/login`, userData);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Register user ------------------------
const register = async (userData) => {
	const response = await axiosPublic.post(`${API_URL}/register`, userData);

	// Save registered user to local storage
	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Logout user ------------------------
const logout = async () => {
	const response = await axiosPrivate.put(`${API_URL}/logout`, {
		withCredentials: true,
	});

	localStorage.removeItem("user");
	console.log(response);

	return response.status;
};

// Update Personal Info ------------------------
const updateUsername = async (userData) => {
	const response = await axiosPrivate.put(
		`${API_URL}/settings/username`,
		userData
	);

	if (response.data) {
		const user = JSON.parse(localStorage.getItem("user"));

		const storeUserData = {
			...response.data,
			accessToken: user.accessToken,
		};

		localStorage.setItem("user", JSON.stringify(storeUserData));

		return storeUserData;
	}
};

const updateEmail = async (userData) => {
	const response = await axiosPrivate.put(
		`${API_URL}/settings/email`,
		userData
	);

	if (response.data) {
		const user = JSON.parse(localStorage.getItem("user"));

		const storeUserData = {
			...response.data,
			accessToken: user.accessToken,
		};

		localStorage.setItem("user", JSON.stringify(storeUserData));

		return storeUserData;
	}
};

const updatePassword = async (userData) => {
	const response = await axiosPrivate.put(
		`${API_URL}/settings/password`,
		userData
	);

	return response.data;
};

const updateAvatar = async (file) => {
	const response = await axiosPrivate.put(`${API_URL}/settings/avatar`, file);

	if (response.data) {
		const user = JSON.parse(localStorage.getItem("user"));

		const storeUserData = {
			...response.data,
			accessToken: user.accessToken,
		};

		localStorage.setItem("user", JSON.stringify(storeUserData));

		return storeUserData;
	}
};

const authService = {
	register,
	login,
	logout,
	refreshToken,
	updateUsername,
	updateEmail,
	updatePassword,
	updateAvatar,
};

export default authService;

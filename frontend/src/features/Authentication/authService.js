import axios from "axios";
import { configuration } from "../helperFunctions/helperFunctions";
import { axiosPublic, axiosPrivate } from "../../api/axios";

// Axios connects the frontend to the backend

// Makes http req. to the API_URL and returns data
const API_URL = "/api/users";

// Register user
const register = async (userData) => {
	const response = await axiosPublic.post(`${API_URL}/register`, userData);

	// Save registered user to local storage
	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Login user
const login = async (userData) => {
	const response = await axiosPublic.post(`${API_URL}/login`, userData);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

const refreshToken = async () => {
	const response = await axiosPrivate.get("/api/refresh", {
		withCredentials: true,
	});

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

// Update user
const updateUsername = async (userData, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/settings/username`,
		userData,
		configuration(accessToken)
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

const updateEmail = async (userData, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/settings/email`,
		userData,
		configuration(accessToken)
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

const updatePassword = async (userData, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/settings/password`,
		userData,
		configuration(accessToken)
	);

	return response.data;
};

const updateAvatar = async (file, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/settings/avatar`,
		file,
		configuration(accessToken)
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

// Logout user
const logout = () => {
	localStorage.removeItem("user");
};

// const API_URL = "api/users";
// const register = async (userData) => {
// 	const response = await axios.post(`${API_URL}/register`, userData);

// 	// Save registered user to local storage
// 	if (response.data) {
// 		localStorage.setItem("user", JSON.stringify(response.data));
// 	}

// 	return response.data;
// };

// // Login user
// const login = async (userData) => {
// 	const response = await axios.post(`${API_URL}/login`, userData);

// 	if (response.data) {
// 		localStorage.setItem("user", JSON.stringify(response.data));
// 	}

// 	return response.data;
// };

// const refreshToken = async () => {
// 	const response = await axios.get("/api/refresh", { withCredentials: true });

// 	if (response.data) {
// 		const user = JSON.parse(localStorage.getItem("user"));

// 		const newAccessToken = {
// 			...user,
// 			accessToken: response.data.accessToken,
// 		};

// 		localStorage.setItem("user", JSON.stringify(newAccessToken));

// 		return newAccessToken;
// 	}
// };

// // Update user
// const updateUsername = async (userData, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/settings/username`,
// 		userData,
// 		configuration(accessToken)
// 	);

// 	if (response.data) {
// 		const user = JSON.parse(localStorage.getItem("user"));

// 		const storeUserData = {
// 			...response.data,
// 			accessToken: user.accessToken,
// 		};

// 		localStorage.setItem("user", JSON.stringify(storeUserData));

// 		return storeUserData;
// 	}
// };

// const updateEmail = async (userData, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/settings/email`,
// 		userData,
// 		configuration(accessToken)
// 	);

// 	if (response.data) {
// 		const user = JSON.parse(localStorage.getItem("user"));

// 		const storeUserData = {
// 			...response.data,
// 			accessToken: user.accessToken,
// 		};

// 		localStorage.setItem("user", JSON.stringify(storeUserData));

// 		return storeUserData;
// 	}
// };

// const updatePassword = async (userData, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/settings/password`,
// 		userData,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const updateAvatar = async (file, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/settings/avatar`,
// 		file,
// 		configuration(accessToken)
// 	);

// 	if (response.data) {
// 		const user = JSON.parse(localStorage.getItem("user"));

// 		const storeUserData = {
// 			...response.data,
// 			accessToken: user.accessToken,
// 		};

// 		localStorage.setItem("user", JSON.stringify(storeUserData));

// 		return storeUserData;
// 	}
// };

// // Logout user
// const logout = () => {
// 	localStorage.removeItem("user");
// };

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

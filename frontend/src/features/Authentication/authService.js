import axios from "axios";
import { configuration } from "../helperFunctions/helperFunctions";

// Axios connects the frontend to the backend

// Makes http req. to the API_URL and returns data
const API_URL = "/api/users";

// Register user
const register = async (userData) => {
	const response = await axios.post(`${API_URL}/register`, userData);

	// Save registered user to local storage
	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Login user
const login = async (userData) => {
	const response = await axios.post(`${API_URL}`, userData);

	console.log(response);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

const refreshToken = async (data) => {
	const response = await axios.get("/refresh", { withCredentials: true });
};

// Update user
const updateUsername = async (userData, token) => {
	const response = await axios.put(
		`${API_URL}/account/username`,
		userData,
		configuration(token)
	);

	if (response.data) {
		const user = JSON.parse(localStorage.getItem("user"));

		const storeUserData = {
			...response.data,
			token: user.token,
		};

		localStorage.setItem("user", JSON.stringify(storeUserData));

		return storeUserData;
	}
};

const updateEmail = async (userData, token) => {
	const response = await axios.put(
		`${API_URL}/account/email`,
		userData,
		configuration(token)
	);

	if (response.data) {
		const user = JSON.parse(localStorage.getItem("user"));

		const storeUserData = {
			...response.data,
			token: user.token,
		};

		localStorage.setItem("user", JSON.stringify(storeUserData));

		return storeUserData;
	}
};

const updatePassword = async (userData, token) => {
	const response = await axios.put(
		`${API_URL}/account/password`,
		userData,
		configuration(token)
	);

	return response.data;
};

const updateAvatar = async (file, token) => {
	const response = await axios.put(
		`${API_URL}/account/profile`,
		file,
		configuration(token)
	);

	if (response.data) {
		const user = JSON.parse(localStorage.getItem("user"));

		const storeUserData = {
			...response.data,
			token: user.token,
		};

		localStorage.setItem("user", JSON.stringify(storeUserData));

		return storeUserData;
	}
};

// Logout user
const logout = () => {
	localStorage.removeItem("user");
};

const authService = {
	register,
	logout,
	login,
	updateUsername,
	updateEmail,
	updatePassword,
	updateAvatar,
};

export default authService;

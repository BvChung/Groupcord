import axios from "axios";
import { configuration } from "../helperFunc/helperFunctions";

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

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Update user
const update = async (userData, token) => {
	const response = await axios.put(
		`${API_URL}/me`,
		userData,
		configuration(token)
	);

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Logout user
const logout = () => {
	localStorage.removeItem("user");
};

const authService = {
	register,
	logout,
	login,
	update,
};

export default authService;

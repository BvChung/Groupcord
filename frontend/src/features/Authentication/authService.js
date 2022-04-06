import axios from "axios";
import { configuration } from "../helperFunctions";

// Axios connects the frontend to the backend

// Makes http req. to the API_URL and returns data
const API_URL = "/api/users";

// Register user
const register = async (userData) => {
	const response = await axios.post(`${API_URL}/register`, userData);

	if (!response) return;

	// Save registered user to local storage
	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Login user
const login = async (userData) => {
	const response = await axios.post(`${API_URL}`, userData);

	if (!response) return;

	// console.log(response.data);

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

	if (!response) return;

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Logout user
const logout = () => {
	localStorage.removeItem("user");
};

const getAll = async (token) => {
	const response = await axios.get(`${API_URL}/all`, configuration(token));

	if (!response) return;

	return response.data;
};

const authService = {
	register,
	logout,
	login,
	update,
	getAll,
};

export default authService;

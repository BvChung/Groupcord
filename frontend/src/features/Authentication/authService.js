import axios from "axios";

// Axios connects the frontend to the backend

// Makes http req. to the API_URL and returns data
const API_URL = "/api/v1/users";

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

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data));
	}

	return response.data;
};

// Logout user
const logout = () => {
	localStorage.removeItem("user");
};

const getCurrentUser = () => {};

const authService = {
	register,
	logout,
	login,
};

export default authService;

import { axiosPublic, axiosPrivate } from "../../api/axios";

const API_URL = "/api/users";

//Use refresh JWT from http cookie to give new access JWT ------------------------
const refreshToken = async () => {
	const response = await axiosPublic.get("/api/refresh", {
		withCredentials: true,
	});

	return response.data;
};

// Login user ------------------------
const login = async (userData) => {
	const response = await axiosPublic.post(`${API_URL}/login`, userData);

	return response.data;
};

// Register user ------------------------
const register = async (userData) => {
	const response = await axiosPublic.post(`${API_URL}/register`, userData);

	return response.data;
};

// Logout user ------------------------
const logout = async () => {
	const response = await axiosPublic.put(`${API_URL}/logout`, {
		withCredentials: true,
	});

	return response.status;
};

// Update Personal Info ------------------------
const updateUsername = async (userData) => {
	const response = await axiosPrivate.put(
		`${API_URL}/settings/username`,
		userData
	);

	return response.data;
};

const updateEmail = async (userData) => {
	const response = await axiosPrivate.put(
		`${API_URL}/settings/email`,
		userData
	);

	return response.data;
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

	return response.data;
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

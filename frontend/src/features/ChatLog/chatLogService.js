import axios from "axios";

const API_URL = "/api/v1/chatlogs";

const createMessage = async (messageData, token) => {
	const configuration = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	// Have to send the token in the http: request to access the route
	const response = await axios.post(API_URL, messageData, configuration);

	if (!response) return;

	return response.data;
};

const getMessage = async (token) => {
	const configuration = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, configuration);

	if (!response) return;

	return response.data;
};

const chatService = {
	createMessage,
	getMessage,
};

export default chatService;

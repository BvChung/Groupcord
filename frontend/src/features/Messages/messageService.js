import axios from "axios";
import { configuration } from "../helperFunctions";

const API_URL = "/api/messages";

const createMessage = async (messageData, token) => {
	// Have to send the token in the http: request to access the route
	const response = await axios.post(API_URL, messageData, configuration(token));

	if (!response) return;

	return response.data;
};

const getMessage = async (groupId, token) => {
	const response = await axios.get(
		`${API_URL}?groupId=${groupId}`,
		configuration(token)
	);

	if (!response) return;

	return response.data;
};

const chatService = {
	createMessage,
	getMessage,
};

export default chatService;

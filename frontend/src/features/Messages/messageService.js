import axios from "axios";
import { configuration } from "../helperFunctions/helperFunctions";

const API_URL = "/api/messages";

const getMessage = async (groupId, token) => {
	const response = await axios.get(
		`${API_URL}?groupId=${groupId}`,
		configuration(token)
	);

	return response.data;
};

const createMessage = async (messageData, token) => {
	// Have to send the token in the http: request to access the route
	const response = await axios.post(API_URL, messageData, configuration(token));

	return response.data;
};

const deleteMessage = async (messageId, token) => {
	const response = await axios.delete(
		`${API_URL}/${messageId}`,
		configuration(token)
	);

	return response.data;
};

const chatService = {
	createMessage,
	getMessage,
	deleteMessage,
};

export default chatService;

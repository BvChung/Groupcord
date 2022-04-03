import axios from "axios";
import { configuration } from "../helperFunctions";

const API_URL = "/api/conversation";

const getConversation = async (token) => {
	const response = await axios.get(API_URL, configuration(token));

	if (!response) return;

	return response.data;
};

const createConversation = async (conversationData, token) => {
	const response = await axios.post(
		API_URL,
		conversationData,
		configuration(token)
	);

	if (!response) return;

	return response.data;
};

const conversationService = {
	getConversation,
	createConversation,
};

export default conversationService;

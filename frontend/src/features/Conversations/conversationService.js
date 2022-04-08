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

const getMembers = async (token) => {
	const response = await axios.get(`${API_URL}/members`, configuration(token));

	if (!response) return;

	return response.data;
};

const addMembers = async (memberId, groupId, token) => {
	const response = await axios.put(
		`${API_URL}/members/${groupId}`,
		{ memberId },
		configuration(token)
	);

	if (!response) return;

	return response.data;
};

const conversationService = {
	getConversation,
	createConversation,
	getMembers,
	addMembers,
};

export default conversationService;

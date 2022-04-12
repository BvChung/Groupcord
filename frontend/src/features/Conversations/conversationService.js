import axios from "axios";
import { configuration } from "../helperFunc/helperFunctions";

const API_URL = "/api/conversation";

const getGroup = async (token) => {
	const response = await axios.get(API_URL, configuration(token));

	return response.data;
};

const createGroup = async (conversationData, token) => {
	const response = await axios.post(
		API_URL,
		conversationData,
		configuration(token)
	);

	return response.data;
};

const getMembers = async (token) => {
	const response = await axios.get(`${API_URL}/members`, configuration(token));

	return response.data;
};

const addMembers = async (memberId, groupId, token) => {
	const response = await axios.put(
		`${API_URL}/add/${groupId}`,
		{ memberId },
		configuration(token)
	);

	return response.data;
};

const removeMembers = async (memberId, groupId, token) => {
	const response = await axios.put(
		`${API_URL}/remove/${groupId}`,
		{ memberId },
		configuration(token)
	);

	return response.data;
};

const conversationService = {
	getGroup,
	createGroup,
	getMembers,
	addMembers,
	removeMembers,
};

export default conversationService;

import axios from "axios";
import { configuration } from "../helperFunctions/helperFunctions";

const API_URL = "/api/chatgroups";

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

const deleteGroup = async (groupId, token) => {
	const response = await axios.delete(
		`${API_URL}/${groupId}`,
		configuration(token)
	);

	return response.data;
};

const updateName = async (groupId, groupName, token) => {
	const response = await axios.put(
		`${API_URL}/update/name/${groupId}`,
		{ groupName },
		configuration(token)
	);

	return response.data;
};

const updateIcon = async (groupId, file, token) => {
	const response = await axios.put(
		`${API_URL}/update/icon/${groupId}`,
		file,
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
		`${API_URL}/members/add/${groupId}`,
		{ memberId },
		configuration(token)
	);

	return response.data;
};

const removeMembers = async (memberId, groupId, token) => {
	const response = await axios.put(
		`${API_URL}/members/remove/${groupId}`,
		{ memberId },
		configuration(token)
	);

	return response.data;
};

const groupService = {
	getGroup,
	createGroup,
	updateName,
	updateIcon,
	deleteGroup,
	getMembers,
	addMembers,
	removeMembers,
};

export default groupService;

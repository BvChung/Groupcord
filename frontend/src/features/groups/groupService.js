import axios from "axios";
import { configuration } from "../helperFunctions/helperFunctions";
import { axiosPublic } from "../../api/axios";

const API_URL = "/api/groups";

const getGroup = async (accessToken) => {
	const response = await axiosPublic.get(API_URL, configuration(accessToken));

	return response.data;
};

const createGroup = async (conversationData, accessToken) => {
	const response = await axiosPublic.post(
		API_URL,
		conversationData,
		configuration(accessToken)
	);

	return response.data;
};

const deleteGroup = async (groupId, accessToken) => {
	const response = await axiosPublic.delete(
		`${API_URL}/${groupId}`,
		configuration(accessToken)
	);

	return response.data;
};

const updateName = async (groupId, groupName, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/update/name/${groupId}`,
		{ groupName },
		configuration(accessToken)
	);

	return response.data;
};

const updateIcon = async (groupId, file, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/update/icon/${groupId}`,
		file,
		configuration(accessToken)
	);

	return response.data;
};

const getMembers = async (accessToken) => {
	const response = await axiosPublic.get(
		`${API_URL}/members`,
		configuration(accessToken)
	);

	return response.data;
};

const addMembers = async (memberId, groupId, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/members/add/${groupId}`,
		{ memberId },
		configuration(accessToken)
	);

	return response.data;
};

const removeMembers = async (memberId, groupId, accessToken) => {
	const response = await axiosPublic.put(
		`${API_URL}/members/remove/${groupId}`,
		{ memberId },
		configuration(accessToken)
	);

	return response.data;
};

// const API_URL = "/api/groups";
// const getGroup = async (accessToken) => {
// 	const response = await axios.get(API_URL, configuration(accessToken));

// 	return response.data;
// };

// const createGroup = async (conversationData, accessToken) => {
// 	const response = await axios.post(
// 		API_URL,
// 		conversationData,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const deleteGroup = async (groupId, accessToken) => {
// 	const response = await axios.delete(
// 		`${API_URL}/${groupId}`,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const updateName = async (groupId, groupName, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/update/name/${groupId}`,
// 		{ groupName },
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const updateIcon = async (groupId, file, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/update/icon/${groupId}`,
// 		file,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const getMembers = async (accessToken) => {
// 	const response = await axios.get(
// 		`${API_URL}/members`,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const addMembers = async (memberId, groupId, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/members/add/${groupId}`,
// 		{ memberId },
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const removeMembers = async (memberId, groupId, accessToken) => {
// 	const response = await axios.put(
// 		`${API_URL}/members/remove/${groupId}`,
// 		{ memberId },
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

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

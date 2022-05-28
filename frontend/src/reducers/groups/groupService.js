import { axiosPrivate } from "../../api/axios";

const API_URL = "/api/groups";

const getGroup = async () => {
	const response = await axiosPrivate.get(API_URL);

	return response.data;
};

const createGroup = async (conversationData) => {
	const response = await axiosPrivate.post(API_URL, conversationData);

	return response.data;
};

const deleteGroup = async (groupId) => {
	const response = await axiosPrivate.delete(`${API_URL}/${groupId}`);

	return response.data;
};

const updateName = async (groupId, groupName) => {
	const response = await axiosPrivate.put(`${API_URL}/name/${groupId}`, {
		groupName,
	});

	return response.data;
};

const updateIcon = async (groupId, file) => {
	const response = await axiosPrivate.put(`${API_URL}/icon/${groupId}`, file);

	return response.data;
};

const getMembers = async () => {
	const response = await axiosPrivate.get(`${API_URL}/members`);

	return response.data;
};

const addMembers = async (memberId, groupId) => {
	const response = await axiosPrivate.put(`${API_URL}/members/add/${groupId}`, {
		memberId,
	});

	return response.data;
};

const removeMembers = async (memberId, groupId) => {
	const response = await axiosPrivate.put(
		`${API_URL}/members/remove/${groupId}`,
		{ memberId }
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

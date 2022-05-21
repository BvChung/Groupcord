import { axiosPrivate } from "../../api/axios";

const API_URL = "/api/messages";

const getMessage = async (groupId) => {
	const response = await axiosPrivate.get(`${API_URL}?groupId=${groupId}`);

	return response.data;
};

const createMessage = async (messageData) => {
	const response = await axiosPrivate.post(API_URL, messageData);

	return response.data;
};

const deleteMessage = async (messageId) => {
	const response = await axiosPrivate.delete(`${API_URL}/${messageId}`);

	return response.data;
};

const chatService = {
	createMessage,
	getMessage,
	deleteMessage,
};

export default chatService;

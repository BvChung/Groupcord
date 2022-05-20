import axios from "axios";
import { configuration } from "../helperFunctions/helperFunctions";
import { axiosPublic } from "../../api/axios";

const API_URL = "/api/messages";

const getMessage = async (groupId, accessToken) => {
	const response = await axiosPublic.get(
		`${API_URL}?groupId=${groupId}`,
		configuration(accessToken)
	);

	return response.data;
};

const createMessage = async (messageData, accessToken) => {
	const response = await axiosPublic.post(
		API_URL,
		messageData,
		configuration(accessToken)
	);

	return response.data;
};

const deleteMessage = async (messageId, accessToken) => {
	const response = await axiosPublic.delete(
		`${API_URL}/${messageId}`,
		configuration(accessToken)
	);

	return response.data;
};

// const API_URL = "/api/messages";
// const getMessage = async (groupId, accessToken) => {
// 	const response = await axios.get(
// 		`${API_URL}?groupId=${groupId}`,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const createMessage = async (messageData, accessToken) => {
// 	const response = await axios.post(
// 		API_URL,
// 		messageData,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

// const deleteMessage = async (messageId, accessToken) => {
// 	const response = await axios.delete(
// 		`${API_URL}/${messageId}`,
// 		configuration(accessToken)
// 	);

// 	return response.data;
// };

const chatService = {
	createMessage,
	getMessage,
	deleteMessage,
};

export default chatService;

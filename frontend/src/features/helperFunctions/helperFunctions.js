export const removeDuplicateData = (data) => {
	return data.filter(
		(el, i, arr) => i === arr.findIndex((position) => position._id === el._id)
	);
};

export const configuration = (token) => {
	// JWT Token
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

export const errorMessage = (error) => {
	const message =
		(error.response && error.response.data && error.response.data.message) ||
		error.message ||
		error.toString();
	return message;
};

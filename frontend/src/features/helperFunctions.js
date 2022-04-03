export const configuration = (token) => {
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

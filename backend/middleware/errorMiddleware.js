const errorHandler = (err, req, res, next) => {
	// set statusecode to 400 if exists else 500 server error
	const statusCode = res.statusCode ? res.statusCode : 500;

	res.status(statusCode);

	res.json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
	});

	next();
};

module.exports = {
	errorHandler,
};

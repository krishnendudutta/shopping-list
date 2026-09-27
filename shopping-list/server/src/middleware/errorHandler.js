export const notFound = (req, res) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
};

export const errorHandler = (error, req, res, next) => {
	const isJsonParseError =
		error instanceof SyntaxError && error.status === 400 && "body" in error;

	const statusCode =
		error.statusCode ||
		error.status ||
		(isJsonParseError
			? 400
			: res.statusCode && res.statusCode !== 200
				? res.statusCode
				: 500);
	const message = isJsonParseError
		? "Invalid JSON request body"
		: error.message || "Server error";

	res.status(statusCode).json({
		success: false,
		message,
	});
};

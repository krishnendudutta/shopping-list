export const getHealth = (req, res) => {
	res.status(200).json({
		success: true,
		message: "Shopping List API is running",
	});
};

export const formatCurrency = (value) => {
	const amount = Number(value) || 0;
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
};

export const formatDate = (value) => {
	if (!value) {
		return "-";
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "-";
	}

	return new Intl.DateTimeFormat("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
};

export const getPriorityLabel = (priority) => {
	if (!priority) {
		return "Medium";
	}

	return priority.charAt(0).toUpperCase() + priority.slice(1);
};

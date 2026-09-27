const validPriorities = ["low", "medium", "high"];
const validPeriods = ["day", "week", "month"];

export const validateShoppingItemForm = (formData) => {
	const errors = {};

	if (!formData.name || formData.name.trim().length === 0) {
		errors.name = "Item name is required.";
	}

	if (Number(formData.quantity) <= 0) {
		errors.quantity = "Quantity must be greater than 0.";
	}

	if (!formData.unit || formData.unit.trim().length === 0) {
		errors.unit = "Unit is required.";
	}

	if (Number(formData.cost) < 0 || Number.isNaN(Number(formData.cost))) {
		errors.cost = "Cost must be 0 or greater.";
	}

	if (!validPriorities.includes(formData.priority)) {
		errors.priority = "Priority must be low, medium, or high.";
	}

	if (!validPeriods.includes(formData.period)) {
		errors.period = "Period must be day, week, or month.";
	}

	if (!formData.date || Number.isNaN(new Date(formData.date).getTime())) {
		errors.date = "Date must be valid.";
	}

	return errors;
};

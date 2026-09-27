const validPriorities = ["low", "medium", "high"];
const validPeriods = ["day", "week", "month"];

const isBlankString = (value) =>
	typeof value !== "string" || value.trim().length === 0;

export const normalizeShoppingItemInput = (input, existingItem = null) => {
	const source = {
		...(existingItem || {}),
		...(input || {}),
	};

	const errors = [];

	const name = typeof source.name === "string" ? source.name.trim() : "";
	if (isBlankString(source.name)) {
		errors.push("Item name is required");
	}

	const quantity = Number(source.quantity);
	if (
		source.quantity === undefined ||
		source.quantity === null ||
		Number.isNaN(quantity)
	) {
		errors.push("Quantity is required and must be a number");
	} else if (quantity <= 0) {
		errors.push("Quantity must be greater than 0");
	}

	const unit = typeof source.unit === "string" ? source.unit.trim() : "";
	if (isBlankString(source.unit)) {
		errors.push("Unit is required");
	}

	const cost = Number(source.cost);
	if (
		source.cost === undefined ||
		source.cost === null ||
		Number.isNaN(cost)
	) {
		errors.push("Cost is required and must be a number");
	} else if (cost < 0) {
		errors.push("Cost cannot be negative");
	}

	const priority =
		typeof source.priority === "string"
			? source.priority.trim().toLowerCase()
			: "medium";
	if (!validPriorities.includes(priority)) {
		errors.push("Priority must be low, medium, or high");
	}

	const vendor =
		typeof source.vendor === "string" ? source.vendor.trim() : "";

	const period =
		typeof source.period === "string"
			? source.period.trim().toLowerCase()
			: "";
	if (!validPeriods.includes(period)) {
		errors.push("Period must be day, week, or month");
	}

	const parsedDate = new Date(source.date);
	if (!source.date || Number.isNaN(parsedDate.getTime())) {
		errors.push("Date is required and must be valid");
	}

	let purchased = false;
	if (typeof source.purchased === "boolean") {
		purchased = source.purchased;
	} else if (source.purchased !== undefined && source.purchased !== null) {
		errors.push("Purchased must be true or false");
	} else if (typeof existingItem?.purchased === "boolean") {
		purchased = existingItem.purchased;
	}

	return {
		errors,
		value: {
			name,
			quantity,
			unit,
			cost,
			priority,
			vendor,
			period,
			date: parsedDate,
			purchased,
		},
	};
};

export const parseQueryBoolean = (value) => {
	if (value === undefined || value === null || value === "") {
		return null;
	}

	if (value === "true") {
		return true;
	}

	if (value === "false") {
		return false;
	}

	return undefined;
};

export const escapeRegex = (value) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

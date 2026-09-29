import mongoose from "mongoose";
import ShoppingItem from "../models/ShoppingItem.js";
import AppError from "../utils/appError.js";
import {
	escapeRegex,
	normalizeShoppingItemInput,
	parseQueryBoolean,
} from "../utils/shoppingItemValidation.js";

const validPriorities = ["low", "medium", "high"];
const validPeriods = ["day", "week", "month"];

const buildDateFilter = (dateValue) => {
	const parsedDate = new Date(dateValue);

	if (Number.isNaN(parsedDate.getTime())) {
		throw new AppError("Date filter must be valid", 400);
	}

	const startOfDay = new Date(parsedDate);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(parsedDate);
	endOfDay.setHours(23, 59, 59, 999);

	return {
		$gte: startOfDay,
		$lte: endOfDay,
	};
};

const buildFilters = (query = {}) => {
	const filters = {};

	if (query.period) {
		const period = String(query.period).trim().toLowerCase();
		if (!validPeriods.includes(period)) {
			throw new AppError("Period must be day, week, or month", 400);
		}
		filters.period = period;
	}

	if (query.priority) {
		const priority = String(query.priority).trim().toLowerCase();
		if (!validPriorities.includes(priority)) {
			throw new AppError("Priority must be low, medium, or high", 400);
		}
		filters.priority = priority;
	}

	const purchased = parseQueryBoolean(query.purchased);
	if (purchased === undefined) {
		throw new AppError("Purchased must be true or false", 400);
	}
	if (purchased !== null) {
		filters.purchased = purchased;
	}

	if (query.vendor) {
		const vendor = String(query.vendor).trim();
		if (vendor.length > 0) {
			filters.vendor = new RegExp(escapeRegex(vendor), "i");
		}
	}

	if (query.search) {
		const search = String(query.search).trim();
		if (search.length > 0) {
			filters.name = new RegExp(escapeRegex(search), "i");
		}
	}

	if (query.date) {
		filters.date = buildDateFilter(query.date);
	}

	return filters;
};

export const getShoppingItems = async (query, userId) => {
	const filters = buildFilters(query);
	filters.user = userId;
	const shoppingItems = await ShoppingItem.find(filters).sort({
		createdAt: -1,
	});

	return {
		shoppingItems,
		count: shoppingItems.length,
	};
};

export const getShoppingItemById = async (shoppingItemId, userId) => {
	if (!mongoose.Types.ObjectId.isValid(shoppingItemId)) {
		throw new AppError("Invalid item ID", 400);
	}

	const shoppingItem = await ShoppingItem.findOne({
		_id: shoppingItemId,
		user: userId,
	});

	if (!shoppingItem) {
		throw new AppError("Shopping item not found", 404);
	}

	return shoppingItem;
};

export const createShoppingItem = async (shoppingItemData, userId) => {
	const { errors, value } = normalizeShoppingItemInput(
		shoppingItemData,
		null,
		userId,
	);

	if (errors.length > 0) {
		throw new AppError(errors.join(". "), 400);
	}

	const shoppingItem = await ShoppingItem.create(value);
	return shoppingItem;
};

export const updateShoppingItem = async (
	shoppingItemId,
	shoppingItemData,
	userId,
) => {
	if (!mongoose.Types.ObjectId.isValid(shoppingItemId)) {
		throw new AppError("Invalid item ID", 400);
	}

	const existingShoppingItem = await ShoppingItem.findOne({
		_id: shoppingItemId,
		user: userId,
	});

	if (!existingShoppingItem) {
		throw new AppError("Shopping item not found", 404);
	}

	const { errors, value } = normalizeShoppingItemInput(
		shoppingItemData,
		existingShoppingItem.toObject(),
		userId,
	);

	if (errors.length > 0) {
		throw new AppError(errors.join(". "), 400);
	}

	existingShoppingItem.name = value.name;
	existingShoppingItem.quantity = value.quantity;
	existingShoppingItem.unit = value.unit;
	existingShoppingItem.cost = value.cost;
	existingShoppingItem.priority = value.priority;
	existingShoppingItem.vendor = value.vendor;
	existingShoppingItem.period = value.period;
	existingShoppingItem.date = value.date;
	existingShoppingItem.purchased = value.purchased;
	existingShoppingItem.user = userId;

	await existingShoppingItem.save();

	return existingShoppingItem;
};

export const deleteShoppingItem = async (shoppingItemId, userId) => {
	if (!mongoose.Types.ObjectId.isValid(shoppingItemId)) {
		throw new AppError("Invalid item ID", 400);
	}

	const shoppingItem = await ShoppingItem.findOneAndDelete({
		_id: shoppingItemId,
		user: userId,
	});

	if (!shoppingItem) {
		throw new AppError("Shopping item not found", 404);
	}

	return shoppingItem;
};

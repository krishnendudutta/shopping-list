import {
	createShoppingItem,
	deleteShoppingItem,
	getShoppingItemById,
	getShoppingItems,
	updateShoppingItem,
} from "../services/shoppingItemService.js";

export const listShoppingItems = async (req, res, next) => {
	try {
		const { shoppingItems, count } = await getShoppingItems(
			req.query,
			req.userId,
		);

		res.status(200).json({
			success: true,
			count,
			data: shoppingItems,
		});
	} catch (error) {
		next(error);
	}
};

export const getShoppingItem = async (req, res, next) => {
	try {
		const shoppingItem = await getShoppingItemById(
			req.params.id,
			req.userId,
		);

		res.status(200).json({
			success: true,
			data: shoppingItem,
		});
	} catch (error) {
		next(error);
	}
};

export const addShoppingItem = async (req, res, next) => {
	try {
		const shoppingItem = await createShoppingItem(req.body, req.userId);

		res.status(201).json({
			success: true,
			message: "Shopping item created successfully",
			data: shoppingItem,
		});
	} catch (error) {
		next(error);
	}
};

export const editShoppingItem = async (req, res, next) => {
	try {
		const shoppingItem = await updateShoppingItem(
			req.params.id,
			req.body,
			req.userId,
		);

		res.status(200).json({
			success: true,
			message: "Shopping item updated successfully",
			data: shoppingItem,
		});
	} catch (error) {
		next(error);
	}
};

export const removeShoppingItem = async (req, res, next) => {
	try {
		await deleteShoppingItem(req.params.id, req.userId);

		res.status(200).json({
			success: true,
			message: "Shopping item deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

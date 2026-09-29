import { Router } from "express";
import {
	addShoppingItem,
	editShoppingItem,
	getShoppingItem,
	listShoppingItems,
	removeShoppingItem,
} from "../controllers/shoppingItemController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listShoppingItems);
router.post("/", addShoppingItem);
router.get("/:id", getShoppingItem);
router.put("/:id", editShoppingItem);
router.delete("/:id", removeShoppingItem);

export default router;

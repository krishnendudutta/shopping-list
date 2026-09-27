import mongoose from "mongoose";

const shoppingItemSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		quantity: {
			type: Number,
			required: true,
			min: 0,
		},
		unit: {
			type: String,
			required: true,
			trim: true,
			maxlength: 50,
		},
		cost: {
			type: Number,
			required: true,
			min: 0,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		vendor: {
			type: String,
			trim: true,
			default: "",
			maxlength: 200,
		},
		period: {
			type: String,
			enum: ["day", "week", "month"],
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		purchased: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

const ShoppingItem = mongoose.model("ShoppingItem", shoppingItemSchema);

export default ShoppingItem;

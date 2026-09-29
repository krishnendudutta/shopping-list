import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			maxlength: 255,
		},
		passwordHash: {
			type: String,
			required: true,
			select: false,
		},
	},
	{
		timestamps: true,
	},
);

const User = mongoose.model("User", userSchema);

export default User;

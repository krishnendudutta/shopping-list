import mongoose from "mongoose";
import ShoppingItem from "../models/ShoppingItem.js";
import User from "../models/User.js";

export const ANONYMOUS_USER_ID = new mongoose.Types.ObjectId(
	"000000000000000000000001",
);
export const ANONYMOUS_USER_EMAIL = "unknown@shopping-list.local";

let cachedAnonymousUser = null;

const createAnonymousUser = async () => {
	return User.create({
		_id: ANONYMOUS_USER_ID,
		name: "Unknown User",
		email: ANONYMOUS_USER_EMAIL,
		passwordHash: "anonymous-user",
	});
};

const migrateLegacyAnonymousUser = async (legacyUser) => {
	await ShoppingItem.updateMany(
		{ user: legacyUser._id },
		{ $set: { user: ANONYMOUS_USER_ID } },
	);

	await User.deleteOne({ _id: legacyUser._id });
};

export const ensureAnonymousUser = async () => {
	if (cachedAnonymousUser) {
		return cachedAnonymousUser;
	}

	let anonymousUser = await User.findById(ANONYMOUS_USER_ID);

	if (!anonymousUser) {
		const legacyAnonymousUser = await User.findOne({
			email: ANONYMOUS_USER_EMAIL,
		});

		if (legacyAnonymousUser) {
			await migrateLegacyAnonymousUser(legacyAnonymousUser);
		}

		anonymousUser = await User.findById(ANONYMOUS_USER_ID);
		if (!anonymousUser) {
			anonymousUser = await createAnonymousUser();
		}
	}

	cachedAnonymousUser = anonymousUser;
	return anonymousUser;
};

import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import User from "../models/User.js";
import { ensureAnonymousUser } from "../services/userService.js";

export const requireAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || "";
		const [scheme, token] = authHeader.split(" ");

		if (scheme !== "Bearer" || !token) {
			const anonymousUser = await ensureAnonymousUser();
			req.user = anonymousUser;
			req.userId = anonymousUser._id.toString();
			next();
			return;
		}

		if (!process.env.JWT_SECRET) {
			throw new AppError("JWT secret is not configured", 500);
		}

		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.userId).select("name email");

		if (!user) {
			throw new AppError("User not found", 401);
		}

		req.user = user;
		req.userId = user._id.toString();
		next();
	} catch (error) {
		next(
			error.statusCode
				? error
				: new AppError("Invalid or expired token", 401),
		);
	}
};

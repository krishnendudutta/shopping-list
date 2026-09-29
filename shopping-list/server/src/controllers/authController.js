import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/appError.js";

const createToken = (user) => {
	if (!process.env.JWT_SECRET) {
		throw new AppError("JWT secret is not configured", 500);
	}

	return jwt.sign(
		{
			userId: user._id.toString(),
			email: user.email,
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
	);
};

const buildAuthResponse = (user) => ({
	success: true,
	data: {
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
		},
		token: createToken(user),
	},
});

export const register = async (req, res, next) => {
	try {
		const name =
			typeof req.body.name === "string" ? req.body.name.trim() : "";
		const email =
			typeof req.body.email === "string"
				? req.body.email.trim().toLowerCase()
				: "";
		const password =
			typeof req.body.password === "string" ? req.body.password : "";

		if (!name) {
			throw new AppError("Name is required", 400);
		}
		if (!email) {
			throw new AppError("Email is required", 400);
		}
		if (!password || password.length < 6) {
			throw new AppError("Password must be at least 6 characters", 400);
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new AppError("Email is already registered", 409);
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash });

		res.status(201).json(buildAuthResponse(user));
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const email =
			typeof req.body.email === "string"
				? req.body.email.trim().toLowerCase()
				: "";
		const password =
			typeof req.body.password === "string" ? req.body.password : "";

		if (!email || !password) {
			throw new AppError("Email and password are required", 400);
		}

		const user = await User.findOne({ email }).select(
			"name email passwordHash",
		);
		if (!user) {
			throw new AppError("Invalid email or password", 401);
		}

		const passwordMatches = await bcrypt.compare(
			password,
			user.passwordHash,
		);
		if (!passwordMatches) {
			throw new AppError("Invalid email or password", 401);
		}

		res.status(200).json(buildAuthResponse(user));
	} catch (error) {
		next(error);
	}
};

export const me = async (req, res) => {
	res.status(200).json({
		success: true,
		data: {
			user: {
				id: req.user._id,
				name: req.user.name,
				email: req.user.email,
			},
		},
	});
};

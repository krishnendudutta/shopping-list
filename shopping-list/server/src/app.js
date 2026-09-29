import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import shoppingItemRoutes from "./routes/shoppingItemRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL || "*",
	}),
);
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", shoppingItemRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

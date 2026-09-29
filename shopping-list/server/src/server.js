import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import { ensureAnonymousUser } from "./services/userService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	await connectDatabase();
	await ensureAnonymousUser();

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

startServer();

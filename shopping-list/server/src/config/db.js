import mongoose from "mongoose";

const connectDatabase = async () => {
	const mongoUri = process.env.MONGODB_URI;

	if (!mongoUri) {
		console.warn("MONGODB_URI is not set. Skipping MongoDB connection.");
		return false;
	}

	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 8000,
			tls: true,
		});
		console.log("Connected to MongoDB");
		return true;
	} catch (error) {
		console.warn(`MongoDB connection failed: ${error.message}`);
		return false;
	}
};

export default connectDatabase;

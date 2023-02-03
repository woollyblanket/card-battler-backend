import mongoose from "mongoose";
import Debug from "debug";
import * as dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
dotenv.config();

const debug = Debug("backend:helpers:db");

export const dbConnectTest = async () => {
	try {
		const mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();
		mongoose.set("strictQuery", false);
		// mongoose.set("debug", true);
		await mongoose.connect(mongoUri);

		return mongoServer;
	} catch (error) {
		return { error };
	}
};

export const dbCloseTest = async (mongoServer) => {
	try {
		await mongoose.disconnect();
		await mongoServer.stop();
	} catch (error) {
		return { error };
	}
};

export const dbConnect = async () => {
	try {
		let dbURI;
		switch (process.env.NODE_ENV) {
			case "development":
				dbURI = process.env.MONGODB_URI_DEV;
				break;
			case "production":
				dbURI = process.env.MONGODB_URI_PROD;
				break;
			case "test":
				dbURI = process.env.MONGODB_URI_TEST;
				break;

			default:
				debug("Couldn't get appropriate DB URI");
				break;
		}

		mongoose.set("strictQuery", false);
		await mongoose.connect(dbURI);

		return mongoose.connection;
	} catch (error) {
		return { error };
	}
};

export const dbWipe = async () => {
	try {
		await mongoose.connection.db.dropDatabase();
	} catch (error) {
		return { error };
	}
};

export const dbClose = async () => {
	return await mongoose.disconnect();
};

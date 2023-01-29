import mongoose from "mongoose";
import Debug from "debug";
import * as dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
dotenv.config();

const debug = Debug("backend:helpers:db");

export const dbConnectTest = async () => {
	const mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	mongoose.set("strictQuery", false);
	await mongoose.connect(mongoUri);

	return mongoServer;
};

export const dbCloseTest = async (mongoServer) => {
	await mongoose.disconnect();
	await mongoServer.stop();
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
		console.log("error :>> ", error);
	}
};

export const dbWipe = async () => {
	try {
		const db = await mongoose.connection.db;
		if (!db) throw "Couldn't get DB";
		const collections = await db.listCollections().toArray();
		collections
			.map((collection) => collection.name)
			.forEach(async (collectionName) => {
				await db.dropCollection(collectionName);
			});
	} catch (error) {
		console.log("error :>> ", error);
	}
};

export const dbClose = async () => {
	return await mongoose.disconnect();
};

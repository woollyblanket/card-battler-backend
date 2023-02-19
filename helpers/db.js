// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Debug from "debug";
import * as dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";

// INTERNAL IMPORTS		///////////////////////////////////////////

dotenv.config();

// PRIVATE 				///////////////////////////////////////////
const debug = Debug("battler:backend:helpers:db");

const getURI = () => {
	return process.env.MONGODB_URI;
};

// PUBLIC 				///////////////////////////////////////////
export const dbConnectTest = async () => {
	try {
		const mongoServer = await MongoMemoryServer.create();
		const mongoUri = mongoServer.getUri();
		mongoose.set("strictQuery", false);
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
		const dbURI = getURI();

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

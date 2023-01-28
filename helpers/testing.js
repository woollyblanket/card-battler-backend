import mongoose from "mongoose";
import { dbConnect, dbClose } from "./db.js";

const wipeDB = async () => {
	const db = await mongoose.connection.db;
	const collections = await db.listCollections().toArray();
	collections
		.map((collection) => collection.name)
		.forEach(async (collectionName) => {
			await db.dropCollection(collectionName);
		});
};

export const dbSetupWipeDBBeforeEach = () => {
	before(async () => {
		return await dbConnect();
	});

	beforeEach(async () => {
		await wipeDB();
		return await "done";
	});

	after(async () => {
		return await dbClose();
	});
};

export const dbSetupWipeAtStart = () => {
	before(async () => {
		await dbConnect();
		await wipeDB();
		return await "done";
	});

	after(async () => {
		return await dbClose();
	});
};

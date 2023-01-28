import mongoose from "mongoose";
import { dbConnect, dbClose, dbWipe } from "./db.js";

export const dbSetupWipeDBBeforeEach = () => {
	before(async () => {
		return await dbConnect();
	});

	beforeEach(async () => {
		return await dbWipe();
	});

	after(async () => {
		return await dbClose();
	});
};

export const dbSetupWipeAtStart = () => {
	before(async () => {
		await dbConnect();
		return await dbWipe();
	});

	after(async () => {
		return await dbClose();
	});
};

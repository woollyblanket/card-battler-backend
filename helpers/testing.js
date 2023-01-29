import { dbWipe, dbConnectTest, dbCloseTest } from "./db.js";

let mongoServer;

export const dbSetupWipeDBBeforeEach = () => {
	before(async () => {
		mongoServer = await dbConnectTest();
	});

	beforeEach(async () => {
		return await dbWipe();
	});

	after(async () => {
		await dbCloseTest(mongoServer);
	});
};

export const dbSetupWipeAtStart = () => {
	before(async () => {
		mongoServer = await dbConnectTest();

		await dbWipe();
	});

	after(async () => {
		await dbCloseTest(mongoServer);
	});
};

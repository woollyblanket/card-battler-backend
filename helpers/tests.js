import { dbWipe, dbConnectTest, dbCloseTest } from "./db.js";
import { expect } from "chai";
import request from "supertest";
import { app } from "../app.mjs";

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

export const expectToBeTrue = (res, details) => {
	if (details.status) expect(res.statusCode).to.equal(details.status);
	if (details.success)
		expect(res.body.data.success).to.equal(details.success);
	if (details.entityIncludes)
		expect(res.body.data.entity).to.include(details.entityIncludes);
	if (details.messageIncludes)
		expect(res.body.data.message).to.include(details.messageIncludes);
	if (details.isError) expect(res.body).to.haveOwnProperty("error");
	if (details.entitiesExist) expect(res.body.data.entities).to.be.an("array");
};

export const addEntity = async (path, data) => {
	const res = await request(app).post(path).send(data);

	return res.body.data.entity._id;
};

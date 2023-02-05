import { dbCloseTest, dbConnectTest, dbWipe } from "./db.js";
import { expect } from "chai";
import request from "supertest";
import { app } from "../app.mjs";

export const dbSetupWipeDBBeforeEach = () => {
	let mongoServer;
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

export const expectToBeTrue = (res, details) => {
	if (details.status) expect(res.statusCode).to.equal(details.status);
	if (details.success)
		expect(res.body.data.success).to.equal(details.success);
	if (details.entityIncludes)
		expect(res.body.data.entity).to.include(details.entityIncludes);
	if (details.messageIncludes)
		expect(res.body.data.message).to.include(details.messageIncludes);
	if (details.isError) expect(res.body).to.haveOwnProperty("error");
	if (details.errorMessage)
		expect(res.body.error.message).to.include(details.errorMessage);
	if (details.entitiesExist) expect(res.body.data.entities).to.be.an("array");
	if (details.attributeEquals)
		expect(res.body.data.entity[details.attributeEquals.name]).to.be.equal(
			details.attributeEquals.value
		);
	if (details.attributeArrayContains)
		expect(
			res.body.data.entity[details.attributeArrayContains.name]
		).to.include.members(details.attributeArrayContains.value);
	if (details.attributeArrayLength)
		expect(
			res.body.data.entity[details.attributeArrayLength.name].length
		).to.be.equal(details.attributeArrayLength.value);
};

export const addEntity = async (path, data) => {
	try {
		const res = await request(app).post(path).send(data);

		if (res.body.error) throw res.body.error;

		return res.body.data.entity._id;
	} catch (error) {
		return { error };
	}
};

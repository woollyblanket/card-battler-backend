// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";
import { expect } from "chai";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { dbCloseTest, dbConnectTest, dbWipe } from "./db.js";
import { app } from "../app.mjs";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
export const dbSetupWipeDBBeforeEach = () => {
	let mongoServer;
	before(async () => {
		mongoServer = await dbConnectTest();
	});

	beforeEach(async () => {
		await dbWipe();
	});

	after(async () => {
		await dbCloseTest(mongoServer);
	});
};

export const expectToBeTrue = (
	res,
	{
		status,
		success,
		entityIncludes,
		messageIncludes,
		isError,
		errorMessage,
		entitiesExist,
		attributeEquals,
		attributeArrayContains,
		attributeArrayLength,
		validationMessageContains,
	}
) => {
	const data = res.body.data;
	const error = res.body.error;
	if (status) expect(res.statusCode).to.equal(status);
	if (success) expect(data.success).to.equal(success);
	if (entityIncludes) expect(data.entity).to.include(entityIncludes);
	if (messageIncludes) expect(data.message).to.include(messageIncludes);
	if (isError) expect(res.body).to.haveOwnProperty("error");
	if (errorMessage) expect(error.message).to.include(errorMessage);
	if (entitiesExist) expect(data.entities).to.be.an("array");
	if (attributeEquals)
		expect(data.entity[attributeEquals.name]).to.be.equal(
			attributeEquals.value
		);
	if (attributeArrayContains)
		expect(data.entity[attributeArrayContains.name]).to.include.members(
			attributeArrayContains.value
		);
	if (attributeArrayLength)
		expect(data.entity[attributeArrayLength.name].length).to.be.equal(
			attributeArrayLength.value
		);

	if (validationMessageContains)
		expect(
			error.errors.some((x) => x.msg.includes(validationMessageContains))
		).to.be.true;
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

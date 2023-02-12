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

export const expectSuccess = (res, status, data) => {
	expect(res.statusCode).to.equal(status);
	expect(res.body.data.success).to.equal(true);
	if (data) expect(res.body.data.entity).to.include(data);
};

export const expectSuccessMultiple = (res, status, data) => {
	expect(res.statusCode).to.equal(status);
	expect(res.body.data.success).to.equal(true);
	expect(res.body.data.entities).to.be.an("array");

	if (data) {
		for (const key of Object.keys(data)) {
			expect(
				res.body.data.entities.some((entity) =>
					entity[key].to.include(data[key])
				)
			).to.be.true;
		}
	}
};

export const expectError = (res, status, validationMessage = "") => {
	expect(res.statusCode).to.equal(status);
	expect(res.body.error.success).to.equal(false);
	expect(res.body).to.haveOwnProperty("error");

	if (validationMessage)
		expect(
			res.body.error.errors.some((x) => x.msg.includes(validationMessage))
		).to.be.true;
};

export const expectPatchUpdate = (res, data) => {
	expect(res.statusCode).to.equal(200);
	expect(res.body.data.success).to.equal(true);

	for (const key of Object.keys(data)) {
		// using "eql" instead of "equal" as that uses deep
		// comparison and works for arrays and objects
		expect(res.body.data.entity[key]).to.be.eql(data[key]);
	}
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

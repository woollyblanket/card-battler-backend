import request from "supertest";
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectToBeTrue,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

describe("POST: /abilities", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new ability", async () => {
		const res = await request(app)
			.post("/abilities")
			.send({ name: "test", description: "test", type: "buff" });

		expectToBeTrue(res, {
			status: 201,
			success: true,
			entityIncludes: { name: "test", description: "test", type: "buff" },
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post("/abilities").send();

		expectToBeTrue(res, {
			status: 400,
			success: false,
		});
	});
});

describe("GET: /abilities/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single ability", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});

		if (abilityID.error) throw abilityID.error;

		const res = await request(app).get(`/abilities/${abilityID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: abilityID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/abilities/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("PATCH: /abilities/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the request is bad", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/abilities/${abilityID}/duration/assign/paused`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should add an energy element to the ability", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/abilities/${abilityID}/energy/assign/+4`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "energy",
				value: "+4",
			},
		});
	});

	it("should increase the duration of the ability", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;
		const res = await request(app).patch(
			`/abilities/${abilityID}/duration/add/3`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "duration",
				value: 3,
			},
		});
	});

	it("should change the ability type", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/abilities/${abilityID}/type/assign/buff-debuff`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "type",
				value: "buff-debuff",
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/abilities/${abilityID}/type/add/buff-debuff`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/abilities/${abilityID}/type/assign/some-bad-type`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("DELETE: /abilities/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single ability", async () => {
		const abilityID = await addEntity("/abilities", {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;
		const res = await request(app).delete(`/abilities/${abilityID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: abilityID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/abilities/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

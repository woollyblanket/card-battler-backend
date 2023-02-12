// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectError,
	expectPatchUpdate,
	expectSuccess,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /abilities", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new ability", async () => {
		const res = await request(app)
			.post("/abilities")
			.send({ name: "test", description: "test", type: "buff" });

		expectSuccess(res, 201, {
			name: "test",
			description: "test",
			type: "buff",
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post("/abilities").send();

		expectError(res, 400);
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

		expectSuccess(res, 200, { _id: abilityID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/abilities/1`);

		expectError(res, 400);
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

		expectError(res, 400);
	});

	it("should add an energy element to the ability", async () => {
		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/abilities/${abilityID}/energy/assign/4`
		);

		expectPatchUpdate(res, { energy: 4 });
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

		expectPatchUpdate(res, { duration: 3 });
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

		expectPatchUpdate(res, { type: "buff-debuff" });
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

		expectError(res, 400);
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

		expectError(res, 400);
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

		expectSuccess(res, 200, { _id: abilityID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/abilities/1`);

		expectError(res, 400);
	});
});

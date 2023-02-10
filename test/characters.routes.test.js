// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectToBeTrue,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /characters", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new character", async () => {
		const res = await request(app)
			.post("/characters")
			.send({ name: "test", archetype: "hero", description: "test" });

		expectToBeTrue(res, {
			status: 201,
			success: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post(`/characters`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("GET: /characters/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single character", async () => {
		const characterID = await addEntity(`/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const res = await request(app).get(`/characters/${characterID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: characterID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/characters/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("PATCH: /characters/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should add to the character's health", async () => {
		const characterID = await addEntity(`/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const res = await request(app).patch(
			`/characters/${characterID}/health/add/4`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				health: 4,
			},
		});
	});

	it("should subtract from the character's energy", async () => {
		const characterID = await addEntity(`/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
			energy: 10,
		});
		if (characterID.error) throw characterID.error;

		const res = await request(app).patch(
			`/characters/${characterID}/energy/subtract/4`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				energy: 6,
			},
		});
	});

	it("should add an ability to a character", async () => {
		const characterID = await addEntity(`/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/characters/${characterID}/abilities/add/${abilityID}`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeArrayContains: {
				name: "abilities",
				value: [abilityID],
			},
		});
	});

	it("should remove an ability from a character", async () => {
		const characterID = await addEntity(`/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});

		await request(app).patch(
			`/characters/${characterID}/abilities/add/${abilityID}`
		);

		const res = await request(app).patch(
			`/characters/${characterID}/abilities/remove/${abilityID}`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeArrayLength: {
				name: "abilities",
				value: 0,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const characterID = await addEntity(`/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const res = await request(app).patch(
			`/characters/${characterID}/name/add/paused`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const characterID = await addEntity(`/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;
		const res = await request(app).patch(
			`/characters/${characterID}/energy/assign/test`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("DELETE: /characters/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single character", async () => {
		const characterID = await addEntity("/characters", {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;
		const res = await request(app).delete(`/characters/${characterID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: characterID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/characters/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

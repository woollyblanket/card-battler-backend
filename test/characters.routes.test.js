import request from "supertest";
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectToBeTrue,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

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

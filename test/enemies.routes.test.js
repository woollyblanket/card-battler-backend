import request from "supertest";
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectToBeTrue,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

describe("POST: /enemies", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new enemy", async () => {
		const res = await request(app)
			.post("/enemies")
			.send({ name: "test", species: "dragon", description: "test" });

		expectToBeTrue(res, {
			status: 201,
			success: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post(`/enemies`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("GET: /enemies/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single enemy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).get(`/enemies/${enemyID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: enemyID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/enemies/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("PATCH: /enemies/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should add to the enemy's health", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).patch(
			`/enemies/${enemyID}/health/add/4`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				health: 4,
			},
		});
	});

	it("should subtract from the enemy's energy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			energy: 10,
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).patch(
			`/enemies/${enemyID}/energy/subtract/4`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				energy: 6,
			},
		});
	});

	it("should add an ability to a enemy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
		});
		if (enemyID.error) throw enemyID.error;

		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await request(app).patch(
			`/enemies/${enemyID}/abilities/add/${abilityID}`
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

	it("should remove an ability from a enemy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
		});
		if (enemyID.error) throw enemyID.error;

		const abilityID = await addEntity(`/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});

		await request(app).patch(
			`/enemies/${enemyID}/abilities/add/${abilityID}`
		);

		const res = await request(app).patch(
			`/enemies/${enemyID}/abilities/remove/${abilityID}`
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
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).patch(
			`/enemies/${enemyID}/name/add/paused`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
		});
		if (enemyID.error) throw enemyID.error;
		const res = await request(app).patch(
			`/enemies/${enemyID}/energy/assign/test`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("DELETE: /enemies/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single enemy", async () => {
		const enemyID = await addEntity("/enemies", {
			name: "test",
			species: "dragon",
			description: "test",
		});
		if (enemyID.error) throw enemyID.error;
		const res = await request(app).delete(`/enemies/${enemyID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: enemyID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/enemies/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

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
describe("POST: /enemies", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new enemy", async () => {
		const res = await request(app)
			.post("/enemies")
			.send({
				name: "test",
				species: "dragon",
				description: "test",
				rarity: "common",
			});

		expectSuccess(res, 201, {
			name: "test",
			species: "dragon",
			description: "test",
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post(`/enemies`);

		expectError(res, 400);
	});
});

describe("GET: /enemies/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single enemy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).get(`/enemies/${enemyID}`);

		expectSuccess(res, 200, { _id: enemyID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/enemies/1`);

		expectError(res, 400);
	});
});

describe("PATCH: /enemies/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should add to the enemy's health", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).patch(
			`/enemies/${enemyID}/health/add/4`
		);

		expectPatchUpdate(res, { health: 4 });
	});

	it("should subtract from the enemy's energy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			energy: 10,
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).patch(
			`/enemies/${enemyID}/energy/subtract/4`
		);

		expectPatchUpdate(res, { energy: 6 });
	});

	it("should add an ability to a enemy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
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

		expectPatchUpdate(res, { abilities: [abilityID] });
	});

	it("should remove an ability from a enemy", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
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

		expectPatchUpdate(res, { abilities: [] });
	});

	it("should warn that the request is bad", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await request(app).patch(
			`/enemies/${enemyID}/name/add/paused`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const enemyID = await addEntity(`/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;
		const res = await request(app).patch(
			`/enemies/${enemyID}/energy/assign/test`
		);

		expectError(res, 400);
	});
});

describe("DELETE: /enemies/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single enemy", async () => {
		const enemyID = await addEntity("/enemies", {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;
		const res = await request(app).delete(`/enemies/${enemyID}`);

		expectSuccess(res, 200, { _id: enemyID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/enemies/1`);

		expectError(res, 400);
	});
});

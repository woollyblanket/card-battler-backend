// EXTERNAL IMPORTS		///////////////////////////////////////////

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	agent,
	dbSetupWipeDBBeforeEach,
	expect4xx,
	expectError,
	expectPatchUpdate,
	expectSuccess,
} from "../helpers/koa.tests.js";
import { API_VERSION } from "../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /enemies", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new enemy", async () => {
		const res = await agent.post(`/${API_VERSION}/enemies`).send({
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
		const res = await agent.post(`/${API_VERSION}/enemies`);

		expectError(res, 400);
	});
});

describe("GET: /enemies/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single enemy", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await agent.get(`/${API_VERSION}/enemies/${enemyID}`);

		expectSuccess(res, 200, { _id: enemyID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/enemies/1`);

		expect4xx(res, 404);
	});
});

describe("PATCH: /enemies/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should add to the enemy's health", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await agent.patch(
			`/${API_VERSION}/enemies/${enemyID}/health/add/4`
		);

		expectPatchUpdate(res, { health: 4 });
	});

	it("should subtract from the enemy's energy", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			energy: 10,
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await agent.patch(
			`/${API_VERSION}/enemies/${enemyID}/energy/subtract/4`
		);

		expectPatchUpdate(res, { energy: 6 });
	});

	it("should add an ability to a enemy", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await agent.patch(
			`/${API_VERSION}/enemies/${enemyID}/abilities/add/${abilityID}`
		);

		expectPatchUpdate(res, { abilities: [abilityID] });
	});

	it("should remove an ability from a enemy", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});

		await agent.patch(
			`/${API_VERSION}/enemies/${enemyID}/abilities/add/${abilityID}`
		);

		const res = await agent.patch(
			`/${API_VERSION}/enemies/${enemyID}/abilities/remove/${abilityID}`
		);

		expectPatchUpdate(res, { abilities: [] });
	});

	it("should warn that the request is bad", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;

		const res = await agent.patch(
			`/${API_VERSION}/enemies/${enemyID}/name/add/paused`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;
		const res = await agent.patch(
			`/${API_VERSION}/enemies/${enemyID}/energy/assign/test`
		);

		expectError(res, 400);
	});
});

describe("DELETE: /enemies/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single enemy", async () => {
		const enemyID = await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "dragon",
			description: "test",
			rarity: "common",
		});
		if (enemyID.error) throw enemyID.error;
		const res = await agent.delete(`/${API_VERSION}/enemies/${enemyID}`);

		expectSuccess(res, 200, { _id: enemyID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.delete(`/${API_VERSION}/enemies/1`);

		expect4xx(res, 404);
	});
});

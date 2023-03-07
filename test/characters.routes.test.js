// EXTERNAL IMPORTS		///////////////////////////////////////////

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	agent,
	dbSetupWipeDBBeforeEach,
	expect404,
	expectError,
	expectPatchUpdate,
	expectSuccess,
} from "../helpers/koa.tests.js";
import { API_VERSION } from "../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /characters", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new character", async () => {
		const res = await agent
			.post(`/${API_VERSION}/characters`)
			.send({ name: "test", archetype: "hero", description: "test" });

		expectSuccess(res, 201, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.post(`/${API_VERSION}/characters`);

		expectError(res, 400);
	});
});

describe("GET: /characters/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single character", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const res = await agent.get(
			`/${API_VERSION}/characters/${characterID}`
		);

		expectSuccess(res, 200, { _id: characterID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/characters/1`);

		expect404(res);
	});
});

describe("PATCH: /characters/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should add to the character's health", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const res = await agent.patch(
			`/${API_VERSION}/characters/${characterID}/health/add/4`
		);

		expectPatchUpdate(res, { health: 4 });
	});

	it("should subtract from the character's energy", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
			energy: 10,
		});
		if (characterID.error) throw characterID.error;

		const res = await agent.patch(
			`/${API_VERSION}/characters/${characterID}/energy/subtract/4`
		);

		expectPatchUpdate(res, { energy: 6 });
	});

	it("should add an ability to a character", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await agent.patch(
			`/${API_VERSION}/characters/${characterID}/abilities/add/${abilityID}`
		);

		expectPatchUpdate(res, { abilities: [abilityID] });
	});

	it("should remove an ability from a character", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			type: "buff",
			description: "test",
		});

		await agent.patch(
			`/${API_VERSION}/characters/${characterID}/abilities/add/${abilityID}`
		);

		const res = await agent.patch(
			`/${API_VERSION}/characters/${characterID}/abilities/remove/${abilityID}`
		);

		expectPatchUpdate(res, { abilities: [] });
	});

	it("should warn that the request is bad", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;

		const res = await agent.patch(
			`/${API_VERSION}/characters/${characterID}/name/add/paused`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;
		const res = await agent.patch(
			`/${API_VERSION}/characters/${characterID}/energy/assign/test`
		);
		expectError(res, 400);
	});
});

describe("DELETE: /characters/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single character", async () => {
		const characterID = await addEntity(`/${API_VERSION}/characters`, {
			name: "test",
			archetype: "hero",
			description: "test",
		});
		if (characterID.error) throw characterID.error;
		const res = await agent.delete(
			`/${API_VERSION}/characters/${characterID}`
		);

		expectSuccess(res, 200, { _id: characterID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.delete(`/${API_VERSION}/characters/1`);

		expect404(res);
	});
});

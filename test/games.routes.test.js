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
import { RARITIES } from "../helpers/constants.js";
import { API_VERSION } from "../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const createGame = async () => {
	// splitting this out, because it's complicated to set up
	for (const rarity of RARITIES) {
		await addEntity(`/${API_VERSION}/enemies`, {
			name: `test - ${rarity}`,
			species: "ooze",
			description: "test",
			rarity,
		});
	}

	const playerID = await addEntity(`/${API_VERSION}/players`, {
		username: "test",
		password: "testtesttest",
	});

	if (playerID.error) throw new Error(playerID.error);
	const characterID = await addEntity(`/${API_VERSION}/characters`, {
		name: "test",
		description: "test",
		archetype: "hero",
	});

	if (characterID.error) throw new Error(characterID.error);
	await addEntity(`/${API_VERSION}/decks`, {
		starter: true,
	});

	// add enemies of each rarity so that they can be spawned
	for (const rarity of RARITIES) {
		await addEntity(`/${API_VERSION}/enemies`, {
			name: "test",
			species: "ooze",
			description: "test",
			rarity,
		});
	}

	const gameID = await addEntity(`/${API_VERSION}/games`, {
		playerID,
		characterID,
	});

	if (gameID.error) throw new Error(gameID.error);

	return gameID;
};

// PUBLIC 				///////////////////////////////////////////
describe("GET: /games/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single game", async () => {
		const gameID = await createGame();
		const res = await agent.get(`/${API_VERSION}/games/${gameID}`);

		expectSuccess(res, 200, { _id: gameID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/games/1`);

		expect404(res);
	});
});

describe("DELETE: /games/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single game", async () => {
		const gameID = await createGame();
		const res = await agent.delete(`/${API_VERSION}/games/${gameID}`);

		expectSuccess(res, 200, { _id: gameID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.delete(`/${API_VERSION}/games/1`);

		expect404(res);
	});
});

describe("PATCH: /games/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	// status is a special case, want to test it explicity

	it("should update the status of the game", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/status/assign/paused`
		);

		expectPatchUpdate(res, { status: "paused" });
	});

	it("should warn that the request is bad", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/status/add/paused`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/status/assign/asdf`
		);

		expectError(res, 400);
	});

	it("should increment the level by 1", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/level/add/1`
		);

		expectPatchUpdate(res, { level: 2 });
	});

	it("should make the round equal 5", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/round/assign/5`
		);

		expectPatchUpdate(res, { round: 5 });
	});

	it("should warn that the request is bad", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/round/assign/asdf`
		);

		expectError(res, 400);
	});

	it("should subtract 1 from the round", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/round/subtract/1`
		);

		expectPatchUpdate(res, { round: 0 });
	});

	it("should warn that the request is bad", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/round/remove/asdf`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const gameID = await createGame();
		const res = await agent.patch(
			`/${API_VERSION}/games/${gameID}/round/remove/1`
		);

		expectError(res, 400);
	});
});

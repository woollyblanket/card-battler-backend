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
describe("GET: /games/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;

		const res = await request(app).get(`/games/${gameID}`);

		expectSuccess(res, 200, { _id: gameID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/games/1`);

		expectError(res, 400);
	});
});

describe("DELETE: /games/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;

		const res = await request(app).delete(`/games/${gameID}`);

		expectSuccess(res, 200, { _id: gameID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/games/1`);

		expectError(res, 400);
	});
});

describe("PATCH: /games/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	// status is a special case, want to test it explicity

	it("should update the status of the game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;

		const res = await request(app).patch(
			`/games/${gameID}/status/assign/paused`
		);

		expectPatchUpdate(res, { status: "paused" });
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/status/add/paused`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/status/assign/asdf`
		);

		expectError(res, 400);
	});

	it("should increment the level by 1", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(`/games/${gameID}/level/add/1`);

		expectPatchUpdate(res, { level: 2 });
	});

	it("should make the round equal 5", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(`/games/${gameID}/round/assign/5`);

		expectPatchUpdate(res, { round: 5 });
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/round/assign/asdf`
		);

		expectError(res, 400);
	});

	it("should subtract 1 from the round", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/round/subtract/1`
		);

		expectPatchUpdate(res, { round: 0 });
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/round/remove/asdf`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(`/games/${gameID}/round/remove/1`);

		expectError(res, 400);
	});
});

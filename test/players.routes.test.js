// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectError,
	expectSuccess,
	expectSuccessMultiple,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /players/", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new player", async () => {
		const res = await request(app)
			.post("/players")
			.send({ username: "test" });

		expectSuccess(res, 201, { username: "test" });
	});

	it("should warn that the player already exists", async () => {
		await request(app).post("/players").send({ username: "test" });
		const res = await request(app)
			.post("/players")
			.send({ username: "test" });

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post("/players");

		expectError(res, 400);
	});
});

describe("GET: /players", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get all players", async () => {
		const res = await request(app).get("/players");

		expectSuccessMultiple(res, 200);
	});
});

describe("GET: /players/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;

		const res = await request(app).get(`/players/${playerID}`);

		expectSuccess(res, 200, { _id: playerID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/players/1`);

		expectError(res, 400);
	});
});

describe("GET: /players/username/:username", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;

		const res = await request(app).get(`/players/username/test`);

		expectSuccess(res, 200, { _id: playerID });
	});

	it("should warn that it can't find the player", async () => {
		const res = await request(app).get(`/players/username/1`);

		expectError(res, 400);
	});
});

describe("GET: /players/:id/games", async () => {
	dbSetupWipeDBBeforeEach();

	it("should list the games associated with the player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;

		const res = await request(app).get(`/players/${playerID}/games`);

		expectSuccessMultiple(res, 200);
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/players/12345/games`);

		expectError(res, 400);
	});
});

describe("PATCH: /players/:id/username/assign/test", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the player already exists", async () => {
		const player = await addEntity("/players", { username: "test1" });
		console.log("player :>> ", player);
		const playerID = await addEntity("/players", { username: "test2" });
		console.log("playerID :>> ", playerID);

		const res = await request(app).patch(
			`/players/${playerID}/username/assign/test1`
		);

		expectError(res, 400, "already exists");
	});
});

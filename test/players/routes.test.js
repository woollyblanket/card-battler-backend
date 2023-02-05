import request from "supertest";
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectToBeTrue,
} from "../../helpers/tests.js";
import { app } from "../../app.mjs";

describe("POST: /players/", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new player", async () => {
		const res = await request(app)
			.post("/players")
			.send({ username: "test" });

		expectToBeTrue(res, {
			status: 201,
			success: true,
			entityIncludes: { username: "test" },
		});
	});

	it("should warn that the player already exists", async () => {
		await request(app).post("/players").send({ username: "test" });
		const res = await request(app)
			.post("/players")
			.send({ username: "test" });

		expectToBeTrue(res, {
			status: 400,
			success: false,
			errorMessage: "Validation error",
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post("/players");

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("GET: /players", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get all players", async () => {
		const res = await request(app).get("/players");

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entitiesExist: true,
		});
	});
});

describe("GET: /players/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;

		const res = await request(app).get(`/players/${playerID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: playerID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/players/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("GET: /players/username/:username", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;

		const res = await request(app).get(`/players/username/test`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: playerID,
			},
		});
	});

	it("should warn that it can't find the player", async () => {
		const res = await request(app).get(`/players/username/1`);

		expectToBeTrue(res, {
			status: 200,
			success: false,
			messageIncludes: "Couldn't find",
		});
	});
});

describe("POST: /players/:id/games", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new game associated with the player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;

		const res = await request(app).post(`/players/${playerID}/games`);

		expectToBeTrue(res, {
			status: 201,
			success: true,
			entityIncludes: {
				player: playerID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post(`/players/12345/games`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("GET: /players/:id/games", async () => {
	dbSetupWipeDBBeforeEach();

	it("should list the games associated with the player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;

		const res = await request(app).get(`/players/${playerID}/games`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entitiesExist: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/players/12345/games`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("GET: /players/:id/games/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a game associated with the player", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;

		const res = await request(app).get(
			`/players/${playerID}/games/${gameID}`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: { _id: gameID },
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/players/12345/games`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const res = await request(app).get(`/players/${playerID}/games/12345`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

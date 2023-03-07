// EXTERNAL IMPORTS		///////////////////////////////////////////

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	agent,
	dbSetupWipeDBBeforeEach,
	expect404,
	expectError,
	expectSuccess,
	expectSuccessMultiple,
} from "../helpers/koa.tests.js";
import { API_VERSION } from "../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /players/", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new player", async () => {
		const res = await agent
			.post(`/${API_VERSION}/players`)
			.send({ username: "test", password: "testtesttest" });

		expectSuccess(res, 201, { username: "test" });
	});

	it("should warn that the player already exists", async () => {
		await agent
			.post(`/${API_VERSION}/players`)
			.send({ username: "test", password: "testtesttest" });
		const res = await agent
			.post(`/${API_VERSION}/players`)
			.send({ username: "test", password: "testtesttest" });

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.post(`/${API_VERSION}/players`);

		expectError(res, 400);
	});
});

describe("GET: /players", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get all players", async () => {
		const res = await agent.get(`/${API_VERSION}/players`);

		console.log("headers", res.headers);

		expectSuccessMultiple(res, 200);
	});
});

describe("GET: /players/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username: "test",
			password: "testtesttest",
		});
		if (playerID.error) throw playerID.error;

		const res = await agent.get(`/${API_VERSION}/players/${playerID}`);

		expectSuccess(res, 200, { _id: playerID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/players/1`);

		expect404(res);
	});
});

describe("GET: /players/username/:username", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username: "test",
			password: "testtesttest",
		});
		if (playerID.error) throw playerID.error;

		const res = await agent.get(`/${API_VERSION}/players/username/test`);

		expectSuccess(res, 200, { _id: playerID });
	});

	it("should warn that it can't find the player", async () => {
		const res = await agent.get(`/${API_VERSION}/players/username/1`);

		expect404(res);
	});
});

describe("GET: /players/:id/games", async () => {
	dbSetupWipeDBBeforeEach();

	it("should list the games associated with the player", async () => {
		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username: "test",
			password: "testtesttest",
		});
		if (playerID.error) throw playerID.error;

		const res = await agent.get(
			`/${API_VERSION}/players/${playerID}/games`
		);

		expectSuccessMultiple(res, 200);
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/players/12345/games`);

		expect404(res);
	});
});

describe("PATCH: /players/:id/username/assign/test", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the player already exists", async () => {
		await addEntity(`/${API_VERSION}/players`, { username: "test1" });

		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username: "test2",
			password: "testtesttest",
		});

		const res = await agent.patch(
			`/${API_VERSION}/players/${playerID}/username/assign/test1`
		);

		expectError(res, 400, "DuplicateError");
	});
});

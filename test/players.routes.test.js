// EXTERNAL IMPORTS		///////////////////////////////////////////
import randomatic from "randomatic";
// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	agent,
	dbSetupWipeDBBeforeEach,
	expect4xx,
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
		const username = randomatic("a", 20);
		const res = await agent
			.post(`/${API_VERSION}/players`)
			.send({ username, password: randomatic("*", 20) });

		expectSuccess(res, 201, { username });
	});

	it("should warn that the player already exists", async () => {
		const username = randomatic("a", 20);
		const password = randomatic("*", 20);
		await agent
			.post(`/${API_VERSION}/players`)
			.send({ username, password });
		const res = await agent
			.post(`/${API_VERSION}/players`)
			.send({ username, password });

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

		expectSuccessMultiple(res, 200);
	});
});

describe("GET: /players/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username: randomatic("a", 20),
			password: randomatic("*", 20),
		});
		if (playerID.error) throw playerID.error;

		const res = await agent.get(`/${API_VERSION}/players/${playerID}`);

		expectSuccess(res, 200, { _id: playerID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/players/1`);

		expect4xx(res, 404);
	});
});

describe("GET: /players/username/:username", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single player", async () => {
		const username = randomatic("a", 20);
		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username,
			password: randomatic("*", 20),
		});
		if (playerID.error) throw playerID.error;

		const res = await agent.get(
			`/${API_VERSION}/players/username/${username}`
		);

		expectSuccess(res, 200, { _id: playerID });
	});

	it("should warn that it can't find the player", async () => {
		const res = await agent.get(`/${API_VERSION}/players/username/1`);

		expect4xx(res, 404);
	});
});

describe("GET: /players/:id/games", async () => {
	dbSetupWipeDBBeforeEach();

	it("should list the games associated with the player", async () => {
		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username: randomatic("a", 20),
			password: randomatic("*", 20),
		});
		if (playerID.error) throw playerID.error;

		const res = await agent.get(
			`/${API_VERSION}/players/${playerID}/games`
		);

		expectSuccessMultiple(res, 200);
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/players/12345/games`);

		expect4xx(res, 404);
	});
});

describe("PATCH: /players/:id/username/assign/test1", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the player already exists", async () => {
		const username1 = randomatic("a", 20);
		const username2 = randomatic("a", 20);
		const password1 = randomatic("*", 20);
		const password2 = randomatic("*", 20);
		await addEntity(`/${API_VERSION}/players`, {
			username: username1,
			password: password1,
		});

		const playerID = await addEntity(`/${API_VERSION}/players`, {
			username: username2,
			password: password2,
		});

		const res = await agent.patch(
			`/${API_VERSION}/players/${playerID}/username/assign/${username1}`
		);

		expectError(res, 400, "DuplicateError");
	});
});

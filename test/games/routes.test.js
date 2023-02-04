import request from "supertest";
import {
	dbSetupWipeDBBeforeEach,
	expectToBeTrue,
	addEntity,
} from "../../helpers/tests.js";
import { app } from "../../app.mjs";

describe("GET: /games/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;

		const res = await request(app).get(`/games/${gameID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: gameID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/games/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
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

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: gameID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/games/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
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

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "status",
				value: "paused",
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/status/add/paused`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/status/assign/asdf`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should increment the level by 1", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(`/games/${gameID}/level/add/1`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "level",
				value: 2,
			},
		});
	});

	it("should make the round equal 5", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(`/games/${gameID}/round/assign/5`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "round",
				value: 5,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/round/assign/asdf`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should subtract 1 from the round", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/round/subtract/1`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "round",
				value: 0,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(
			`/games/${gameID}/round/remove/asdf`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;
		const res = await request(app).patch(`/games/${gameID}/round/remove/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

import request from "supertest";
import {
	dbSetupWipeAtStart,
	expectToBeTrue,
	addEntity,
} from "../../helpers/tests.js";
import { app } from "../../app.mjs";

describe("GET: /games/:id", async () => {
	dbSetupWipeAtStart();

	it("should get a single game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		const gameID = await addEntity(`/players/${playerID}/games`);

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
	dbSetupWipeAtStart();

	it("should delete a single game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		const gameID = await addEntity(`/players/${playerID}/games`);

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

describe("PATCH: /games/:id/:attribute/:operation/:amount", async () => {
	dbSetupWipeAtStart();

	let gameID;

	// status is a special case, want to test it explicity

	it("should update the status of the game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		gameID = await addEntity(`/players/${playerID}/games`);

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
		const res = await request(app).patch(`/games/${gameID}/round/assign/5`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "level",
				value: 2,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).patch(
			`/games/${gameID}/round/assign/asdf`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should subract 2 from the round", async () => {
		const res = await request(app).patch(
			`/games/${gameID}/round/subtract/2`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "round",
				value: 3,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).patch(
			`/games/${gameID}/round/remove/asdf`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

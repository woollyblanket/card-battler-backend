import request from "supertest";
import {
	dbSetupWipeAtStart,
	expectToBeTrue,
	addEntity,
} from "../../helpers/tests.js";
import { app } from "../../app.mjs";

describe("POST: /decks", async () => {
	dbSetupWipeAtStart();

	it("should create a new deck", async () => {
		const res = await request(app).post("/decks").send();

		expectToBeTrue(res, {
			status: 201,
			success: true,
		});
	});

	it("should create a new starter deck", async () => {
		const res = await request(app).post("/decks").send({ starter: true });

		expectToBeTrue(res, {
			status: 201,
			success: true,
			entityIncludes: { starter: true },
		});
	});

	it("should create a new deck attached to a game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		const gameID = await addEntity(`/players/${playerID}/games`);

		const res = await request(app).post("/decks").send({ game: gameID });

		expectToBeTrue(res, {
			status: 201,
			success: true,
			entityIncludes: { game: gameID },
		});
	});
});

describe("GET: /decks/:id", async () => {
	dbSetupWipeAtStart();

	it("should get a single deck", async () => {
		const deckID = await addEntity(`/decks`);

		const res = await request(app).get(`/decks/${deckID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: deckID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/decks/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

describe("PATCH: /decks/:id/:attribute/:operation/:amount", async () => {
	dbSetupWipeAtStart();

	let deckID, cardID;

	it("should warn that the request is bad", async () => {
		deckID = await addEntity(`/decks`);

		const res = await request(app).patch(
			`/decks/${deckID}/game/add/paused`
		);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).patch(`/decks/${deckID}/game/assign/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should attach the deck to a game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		const gameID = await addEntity(`/players/${playerID}/games`);

		const res = await request(app).patch(
			`/decks/${deckID}/game/assign/${gameID}`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "game",
				value: gameID,
			},
		});
	});

	it("should change the deck to a starter deck", async () => {
		const res = await request(app).patch(
			`/decks/${deckID}/starter/assign/true`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "starter",
				value: true,
			},
		});
	});

	it("should add a card to the deck", async () => {
		cardID = await addEntity("/cards", {
			name: "test",
			type: "healer",
			description: "test",
		});
		const res = await request(app).patch(
			`/decks/${deckID}/cards/add/${cardID}`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeArrayContains: {
				name: "cards",
				value: [cardID],
			},
		});
	});

	it("should remove a card from the deck", async () => {
		const res = await request(app).patch(
			`/decks/${deckID}/cards/remove/${cardID}`
		);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeArrayLength: {
				name: "cards",
				value: 0,
			},
		});
	});
});

describe("DELETE: /decks/:id", async () => {
	dbSetupWipeAtStart();

	it("should delete a single deck", async () => {
		const deckID = await addEntity("/decks");

		const res = await request(app).delete(`/decks/${deckID}`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: deckID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/decks/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectError,
	expectPatchUpdate,
	expectSuccess,
	expectSuccessMultiple,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /decks", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new deck", async () => {
		const res = await request(app).post("/decks").send();

		expectSuccess(res, 201);
	});

	it("should create a new starter deck", async () => {
		const res = await request(app).post("/decks").send({ starter: true });

		expectSuccess(res, 201, { starter: true });
	});

	it("should create a new deck attached to a game", async () => {
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;

		const res = await request(app).post("/decks").send({ game: gameID });

		expectSuccess(res, 201, { game: gameID });
	});
});

describe("GET: /decks/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single deck", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;

		const res = await request(app).get(`/decks/${deckID}`);

		expectSuccess(res, 200, { _id: deckID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/decks/1`);

		expectError(res, 400);
	});
});

describe("GET: /decks/:id/cards", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get all the cards belonging to a deck", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;

		const cardID = await addEntity(`/cards`, {
			name: "test",
			type: "buff",
			description: "test",
		});
		if (cardID.error) throw cardID.error;

		await request(app).patch(`/decks/${deckID}/cards/add/${cardID}`);

		const res = await request(app).get(`/decks/${deckID}/cards`);

		expectSuccessMultiple(res, 200);
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/decks/1/cards`);

		expectError(res, 400);
	});
});

describe("PATCH: /decks/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the request is bad", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;

		const res = await request(app).patch(
			`/decks/${deckID}/game/add/paused`
		);
		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;
		const res = await request(app).patch(`/decks/${deckID}/game/assign/1`);

		expectError(res, 400);
	});

	it("should attach the deck to a game", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;
		const playerID = await addEntity("/players", { username: "test" });
		if (playerID.error) throw playerID.error;
		const gameID = await addEntity(`/players/${playerID}/games`);
		if (gameID.error) throw gameID.error;

		const res = await request(app).patch(
			`/decks/${deckID}/game/assign/${gameID}`
		);

		expectPatchUpdate(res, { game: gameID });
	});

	it("should change the deck to a starter deck", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;
		const res = await request(app).patch(
			`/decks/${deckID}/starter/assign/true`
		);

		expectPatchUpdate(res, { starter: true });
	});

	it("should add a card to the deck", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;
		const cardID = await addEntity("/cards", {
			name: "test",
			type: "heal",
			description: "test",
		});
		if (cardID.error) throw cardID.error;
		const res = await request(app).patch(
			`/decks/${deckID}/cards/add/${cardID}`
		);

		expectPatchUpdate(res, { cards: [cardID] });
	});

	it("should remove a card from the deck", async () => {
		const deckID = await addEntity(`/decks`);
		if (deckID.error) throw deckID.error;
		const cardID = await addEntity("/cards", {
			name: "test",
			type: "heal",
			description: "test",
		});
		if (cardID.error) throw cardID.error;
		await request(app).patch(`/decks/${deckID}/cards/add/${cardID}`);
		const res = await request(app).patch(
			`/decks/${deckID}/cards/remove/${cardID}`
		);

		expectPatchUpdate(res, { cards: [] });
	});
});

describe("DELETE: /decks/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single deck", async () => {
		const deckID = await addEntity("/decks");
		if (deckID.error) throw deckID.error;
		const res = await request(app).delete(`/decks/${deckID}`);

		expectSuccess(res, 200, { _id: deckID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/decks/1`);

		expectError(res, 400);
	});
});

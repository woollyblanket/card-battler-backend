// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	API_VERSION,
	addEntity,
	dbSetupWipeDBBeforeEach,
	expect404,
	expectError,
	expectPatchUpdate,
	expectSuccess,
	expectSuccessMultiple,
} from "../helpers/koa.tests.js";
import { app } from "../koa.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /decks", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new deck", async () => {
		const res = await request(app.callback())
			.post(`/${API_VERSION}/decks`)
			.send();

		expectSuccess(res, 201);
	});

	it("should create a new starter deck", async () => {
		const res = await request(app.callback())
			.post(`/${API_VERSION}/decks`)
			.send({ starter: true });

		expectSuccess(res, 201, { starter: true });
	});
});

describe("GET: /decks/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single deck", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;

		const res = await request(app.callback()).get(
			`/${API_VERSION}/decks/${deckID}`
		);

		expectSuccess(res, 200, { _id: deckID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app.callback()).get(
			`/${API_VERSION}/decks/1`
		);

		expect404(res);
	});
});

describe("GET: /decks/:id/cards", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get all the cards belonging to a deck", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;

		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			type: "buff",
			description: "test",
		});
		if (cardID.error) throw cardID.error;

		await request(app.callback()).patch(
			`/${API_VERSION}/decks/${deckID}/cards/add/${cardID}`
		);

		const res = await request(app.callback()).get(
			`/${API_VERSION}/decks/${deckID}/cards`
		);

		expectSuccessMultiple(res, 200);
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app.callback()).get(
			`/${API_VERSION}/decks/1/cards`
		);

		expect404(res);
	});
});

describe("PATCH: /decks/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the request is bad", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;

		const res = await request(app.callback()).patch(
			`/${API_VERSION}/decks/${deckID}/game/add/paused`
		);
		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;
		const res = await request(app.callback()).patch(
			`/${API_VERSION}/decks/${deckID}/game/assign/1`
		);

		expectError(res, 400);
	});

	it("should change the deck to a starter deck", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;
		const res = await request(app.callback()).patch(
			`/${API_VERSION}/decks/${deckID}/starter/assign/true`
		);

		expectPatchUpdate(res, { starter: true });
	});

	it("should add a card to the deck", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			type: "heal",
			description: "test",
		});
		if (cardID.error) throw cardID.error;
		const res = await request(app.callback()).patch(
			`/${API_VERSION}/decks/${deckID}/cards/add/${cardID}`
		);

		expectPatchUpdate(res, { cards: [cardID] });
	});

	it("should remove a card from the deck", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			type: "heal",
			description: "test",
		});
		if (cardID.error) throw cardID.error;
		await request(app.callback()).patch(
			`/${API_VERSION}/decks/${deckID}/cards/add/${cardID}`
		);
		const res = await request(app.callback()).patch(
			`/${API_VERSION}/decks/${deckID}/cards/remove/${cardID}`
		);

		expectPatchUpdate(res, { cards: [] });
	});
});

describe("DELETE: /decks/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single deck", async () => {
		const deckID = await addEntity(`/${API_VERSION}/decks`);
		if (deckID.error) throw deckID.error;
		const res = await request(app.callback()).delete(
			`/${API_VERSION}/decks/${deckID}`
		);

		expectSuccess(res, 200, { _id: deckID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app.callback()).delete(
			`/${API_VERSION}/decks/1`
		);

		expect404(res);
	});
});

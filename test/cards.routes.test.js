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
describe("POST: /cards", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new card", async () => {
		const res = await request(app)
			.post("/cards")
			.send({ name: "test", description: "test", type: "heal" });

		expectSuccess(res, 201, {
			name: "test",
			description: "test",
			type: "heal",
		});
	});

	it("should warn that the rarity is incorrect", async () => {
		const res = await request(app).post("/cards").send({
			name: "test",
			description: "test",
			type: "heal",
			rarity: "test",
		});

		expectError(res, 400);
	});

	it("should warn that the data type is incorrect", async () => {
		const res = await request(app).post("/cards").send({
			name: "test",
			description: "test",
			type: "heal",
			energy: "test",
		});

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post("/cards").send();

		expectError(res, 400);
	});
});

describe("GET: /cards/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single card", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});

		if (cardID.error) throw cardID.error;

		const res = await request(app).get(`/cards/${cardID}`);

		expectSuccess(res, 200, { _id: cardID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/cards/1`);

		expectError(res, 400);
	});
});

describe("PATCH: /cards/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the request is bad", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await request(app).patch(
			`/cards/${cardID}/duration/assign/paused`
		);

		expectError(res, 400);
	});

	it("should add a damage element to the card", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await request(app).patch(
			`/cards/${cardID}/damage/assign/4`
		);

		expectPatchUpdate(res, { damage: 4 });
	});

	it("should increase the duration of the card", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;
		const res = await request(app).patch(`/cards/${cardID}/duration/add/3`);

		expectPatchUpdate(res, 200, { duration: 3 });
	});

	it("should change the card type", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await request(app).patch(
			`/cards/${cardID}/type/assign/shield`
		);

		expectPatchUpdate(res, { type: "shield" });
	});

	it("should warn that the request is bad", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await request(app).patch(
			`/cards/${cardID}/type/remove/shield`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await request(app).patch(
			`/cards/${cardID}/type/assign/some-bad-type`
		);

		expectError(res, 400);
	});
});

describe("DELETE: /cards/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single card", async () => {
		const cardID = await addEntity("/cards", {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;
		const res = await request(app).delete(`/cards/${cardID}`);

		expectSuccess(res, 200, { _id: cardID });
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/cards/1`);

		expectError(res, 400);
	});
});

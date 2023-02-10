import request from "supertest";
import {
	addEntity,
	dbSetupWipeDBBeforeEach,
	expectToBeTrue,
} from "../helpers/tests.js";
import { app } from "../app.mjs";

describe("POST: /cards", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new card", async () => {
		const res = await request(app)
			.post("/cards")
			.send({ name: "test", description: "test", type: "heal" });

		expectToBeTrue(res, {
			status: 201,
			success: true,
			entityIncludes: {
				name: "test",
				description: "test",
				type: "heal",
			},
		});
	});

	it("should warn that the rarity is incorrect", async () => {
		const res = await request(app).post("/cards").send({
			name: "test",
			description: "test",
			type: "heal",
			rarity: "test",
		});

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the data type is incorrect", async () => {
		const res = await request(app).post("/cards").send({
			name: "test",
			description: "test",
			type: "heal",
			energy: "test",
		});

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post("/cards").send();

		expectToBeTrue(res, {
			status: 400,
			success: false,
		});
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

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: cardID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).get(`/cards/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
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

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
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

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "damage",
				value: 4,
			},
		});
	});

	it("should increase the duration of the card", async () => {
		const cardID = await addEntity(`/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;
		const res = await request(app).patch(`/cards/${cardID}/duration/add/3`);

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "duration",
				value: 3,
			},
		});
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

		expectToBeTrue(res, {
			status: 200,
			success: true,
			attributeEquals: {
				name: "type",
				value: "shield",
			},
		});
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

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
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

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
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

		expectToBeTrue(res, {
			status: 200,
			success: true,
			entityIncludes: {
				_id: cardID,
			},
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).delete(`/cards/1`);

		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
		});
	});
});

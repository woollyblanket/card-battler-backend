// EXTERNAL IMPORTS		///////////////////////////////////////////

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	agent,
	dbSetupWipeDBBeforeEach,
	expect4xx,
	expectError,
	expectPatchUpdate,
	expectSuccess,
} from "../helpers/koa.tests.js";
import { API_VERSION } from "../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /cards", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new card", async () => {
		const res = await agent
			.post(`/${API_VERSION}/cards`)
			.send({ name: "test", description: "test", type: "heal" });

		expectSuccess(res, 201, {
			name: "test",
			description: "test",
			type: "heal",
		});
	});

	it("should warn that the rarity is incorrect", async () => {
		const res = await agent.post(`/${API_VERSION}/cards`).send({
			name: "test",
			description: "test",
			type: "heal",
			rarity: "test",
		});

		expectError(res, 400);
	});

	it("should warn that the data type is incorrect", async () => {
		const res = await agent.post(`/${API_VERSION}/cards`).send({
			name: "test",
			description: "test",
			type: "heal",
			energy: "test",
		});

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.post(`/${API_VERSION}/cards`).send();

		expectError(res, 400);
	});
});

describe("GET: /cards/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single card", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});

		if (cardID.error) throw cardID.error;

		const res = await agent.get(`/${API_VERSION}/cards/${cardID}`);

		expectSuccess(res, 200, { _id: cardID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/cards/1`);

		expect4xx(res, 404);
	});
});

describe("PATCH: /cards/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the request is bad", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await agent.patch(
			`/${API_VERSION}/cards/${cardID}/duration/assign/paused`
		);

		expectError(res, 400);
	});

	it("should add a damage element to the card", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await agent.patch(
			`/${API_VERSION}/cards/${cardID}/damage/assign/4`
		);

		expectPatchUpdate(res, { damage: 4 });
	});

	it("should increase the duration of the card", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;
		const res = await agent.patch(
			`/${API_VERSION}/cards/${cardID}/duration/add/3`
		);

		expectPatchUpdate(res, { duration: 3 });
	});

	it("should change the card type", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await agent.patch(
			`/${API_VERSION}/cards/${cardID}/type/assign/shield`
		);

		expectPatchUpdate(res, { type: "shield" });
	});

	it("should warn that the request is bad", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await agent.patch(
			`/${API_VERSION}/cards/${cardID}/type/remove/shield`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;

		const res = await agent.patch(
			`/${API_VERSION}/cards/${cardID}/type/assign/some-bad-type`
		);

		expectError(res, 400);
	});
});

describe("DELETE: /cards/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single card", async () => {
		const cardID = await addEntity(`/${API_VERSION}/cards`, {
			name: "test",
			description: "test",
			type: "heal",
		});
		if (cardID.error) throw cardID.error;
		const res = await agent.delete(`/${API_VERSION}/cards/${cardID}`);

		expectSuccess(res, 200, { _id: cardID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.delete(`/${API_VERSION}/cards/1`);

		expect4xx(res, 404);
	});
});

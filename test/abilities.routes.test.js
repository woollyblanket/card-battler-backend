// EXTERNAL IMPORTS		///////////////////////////////////////////

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	addEntity,
	agent,
	dbSetupWipeDBBeforeEach,
	expect404,
	expectError,
	expectPatchUpdate,
	expectSuccess,
} from "../helpers/koa.tests.js";
import { API_VERSION } from "../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("POST: /abilities", async () => {
	dbSetupWipeDBBeforeEach();

	it("should create a new ability", async () => {
		const res = await agent
			.post(`/${API_VERSION}/abilities`)
			.send({ name: "test", description: "test", type: "buff" });

		expectSuccess(res, 201, {
			name: "test",
			description: "test",
			type: "buff",
		});
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.post(`/${API_VERSION}/abilities`).send();

		expectError(res, 400);
	});
});

describe("GET: /abilities/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should get a single ability", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});

		if (abilityID.error) throw abilityID.error;

		const res = await agent.get(`/${API_VERSION}/abilities/${abilityID}`);

		expectSuccess(res, 200, { _id: abilityID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.get(`/${API_VERSION}/abilities/1`);

		expect404(res);
	});
});

describe("PATCH: /abilities/:id/:attribute/:operation/:value", async () => {
	dbSetupWipeDBBeforeEach();

	it("should warn that the request is bad", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await agent.patch(
			`/${API_VERSION}/abilities/${abilityID}/duration/assign/paused`
		);

		expectError(res, 400);
	});

	it("should add an energy element to the ability", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await agent.patch(
			`/${API_VERSION}/abilities/${abilityID}/energy/assign/4`
		);

		expectPatchUpdate(res, { energy: 4 });
	});

	it("should increase the duration of the ability", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;
		const res = await agent.patch(
			`/${API_VERSION}/abilities/${abilityID}/duration/add/3`
		);

		expectPatchUpdate(res, { duration: 3 });
	});

	it("should change the ability type", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await agent.patch(
			`/${API_VERSION}/abilities/${abilityID}/type/assign/buff-debuff`
		);

		expectPatchUpdate(res, { type: "buff-debuff" });
	});

	it("should warn that the request is bad", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await agent.patch(
			`/${API_VERSION}/abilities/${abilityID}/type/add/buff-debuff`
		);

		expectError(res, 400);
	});

	it("should warn that the request is bad", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;

		const res = await agent.patch(
			`/${API_VERSION}/abilities/${abilityID}/type/assign/some-bad-type`
		);

		expectError(res, 400);
	});
});

describe("DELETE: /abilities/:id", async () => {
	dbSetupWipeDBBeforeEach();

	it("should delete a single ability", async () => {
		const abilityID = await addEntity(`/${API_VERSION}/abilities`, {
			name: "test",
			description: "test",
			type: "buff",
		});
		if (abilityID.error) throw abilityID.error;
		const res = await agent.delete(
			`/${API_VERSION}/abilities/${abilityID}`
		);

		expectSuccess(res, 200, { _id: abilityID });
	});

	it("should warn that the request is bad", async () => {
		const res = await agent.delete(`/${API_VERSION}/abilities/1`);

		expect404(res);
	});
});

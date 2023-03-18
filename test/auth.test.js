import randomatic from "randomatic";

import { API_VERSION } from "../helpers/constants.js";
import {
	addEntity,
	agent,
	closeServer,
	dbSetupWipeDBBeforeEach,
	expect4xx,
	expectError,
	expectSuccess,
} from "../helpers/koa.tests.js";

describe("GET /cards no user setup", () => {
	closeServer();
	it("should give an unauthorised error", async () => {
		const res = await agent.get(`/${API_VERSION}/cards`);

		expect4xx(res, 401);
	});
});

describe("GET: /login", async () => {
	dbSetupWipeDBBeforeEach(false);

	it("should log a player in", async () => {
		const username = randomatic("a", 20);
		const password = randomatic("*", 20);
		await addEntity(`/${API_VERSION}/players`, {
			username,
			password,
		});
		const res = await agent.post(`/${API_VERSION}/auth/login`).send({
			username,
			password,
		});

		expectSuccess(res, 200);
	});

	it("should give an error as the user isn't set", async () => {
		const username = randomatic("a", 20);
		const password = randomatic("*", 20);

		const res = await agent.post(`/${API_VERSION}/auth/login`).send({
			username,
			password,
		});

		console.log("res.body :>> ", res.body);

		expectError(res, 200);
	});

	it("should give an error as the password isn't correct", async () => {
		const username = randomatic("a", 20);
		const password = randomatic("*", 20);
		await addEntity(`/${API_VERSION}/players`, {
			username,
			password,
		});
		const res = await agent.post(`/${API_VERSION}/auth/login`).send({
			username,
			password: `${password}1234`,
		});

		expectError(res, 200);
	});
});

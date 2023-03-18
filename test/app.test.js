// EXTERNAL IMPORTS		///////////////////////////////////////////
import * as dotenv from "dotenv";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	agent,
	dbSetupWipeDBBeforeEach,
	expect4xx,
	expect500,
} from "../helpers/koa.tests.js";
import { API_VERSION } from "../helpers/constants.js";

dotenv.config();
// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////

describe("GET /404 no version prefix", () => {
	dbSetupWipeDBBeforeEach();
	it("should give a 404", async () => {
		const res = await agent.get(`/404`);

		expect4xx(res, 404);
	});
});

describe("GET /404", () => {
	dbSetupWipeDBBeforeEach();
	it("should give a 404", async () => {
		const res = await agent.get(`/${API_VERSION}/404`);

		expect4xx(res, 404);
	});
});

describe("GET /500", () => {
	dbSetupWipeDBBeforeEach();
	it("should give a 500 server error", async () => {
		const res = await agent.get(`/${API_VERSION}/500`);

		expect500(res);
	});
});

describe("GET /", () => {
	dbSetupWipeDBBeforeEach();
	it("should give a 404", async () => {
		const res = await agent.get(`/${API_VERSION}`);

		expect4xx(res, 404);
	});
});

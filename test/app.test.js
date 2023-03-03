// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";
import * as dotenv from "dotenv";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { app } from "../koa.js";
import {
	API_VERSION,
	closeServer,
	expect404,
	expect500,
} from "../helpers/koa.tests.js";

dotenv.config();
// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("GET /404 no version prefix", () => {
	closeServer();
	it("should give a 404", async () => {
		const res = await request(app.callback()).get(`/404`);

		expect404(res);
	});
});

describe("GET /404", () => {
	closeServer();
	it("should give a 404", async () => {
		const res = await request(app.callback()).get(`/${API_VERSION}/404`);

		expect404(res);
	});
});

describe("GET /500", () => {
	closeServer();
	it("should give a 500 server error", async () => {
		const res = await request(app.callback()).get(`/${API_VERSION}/500`);

		expect500(res);
	});
});

describe("GET /", () => {
	closeServer();
	it("should give a 404", async () => {
		const res = await request(app.callback()).get(`/${API_VERSION}`);

		expect404(res);
	});
});

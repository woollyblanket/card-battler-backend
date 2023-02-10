// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { app } from "../app.mjs";
import { expectToBeTrue } from "../helpers/tests.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("GET /404/404/404", () => {
	it("should give a 404", async () => {
		const res = await request(app).get(`/404/404/404`);
		expectToBeTrue(res, {
			status: 404,
			success: false,
			isError: true,
		});
	});
});

describe("GET /500", () => {
	it("should give a 500 server error", async () => {
		const res = await request(app).get(`/500`);
		expectToBeTrue(res, {
			status: 500,
		});
	});
});

describe("GET /some-unknown-path", () => {
	it("should give an invalid entity warning", async () => {
		const res = await request(app).get(`/some-unknown-path`);
		expectToBeTrue(res, {
			status: 400,
			success: false,
			isError: true,
			validationMessageContains: "Invalid entity",
		});
	});
});

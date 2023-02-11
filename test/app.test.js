// EXTERNAL IMPORTS		///////////////////////////////////////////
import request from "supertest";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { app } from "../app.mjs";
import { expectError } from "../helpers/tests.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("GET /404/404/404", () => {
	it("should give a 404", async () => {
		const res = await request(app).get(`/404/404/404`);

		expectError(res, 404);
	});
});

describe("GET /500", () => {
	it("should give a 500 server error", async () => {
		const res = await request(app).get(`/500`);

		expectError(res, 500);
	});
});

describe("GET /some-unknown-path", () => {
	it("should give an invalid entity warning", async () => {
		const res = await request(app).get(`/some-unknown-path`);

		expectError(res, 400, "Invalid entity");
	});
});

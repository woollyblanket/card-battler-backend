import request from "supertest";
import { app } from "../app.mjs";
import { expectToBeTrue } from "../helpers/tests.js";

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

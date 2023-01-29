import { expect } from "chai";
import request from "supertest";
import { dbSetupWipeAtStart } from "../../helpers/testing.js";
import { app } from "../../app.mjs";

describe("POST: /players/", async () => {
	dbSetupWipeAtStart();

	it("should create a new player", async () => {
		const res = await request(app)
			.post("/players")
			.send({ username: "test" });

		expect(res.statusCode).to.equal(201);
		expect(res.body.data.success).to.equal(true);
		expect(res.body.data.entity).to.include({ username: "test" });
	});

	it("should warn that the player already exists", async () => {
		const res = await request(app)
			.post("/players")
			.send({ username: "test" });

		expect(res.statusCode).to.equal(200);
		expect(res.body.data.success).to.equal(false);
		expect(res.body.data.message).to.include("already exists");
	});

	it("should warn that the request is bad", async () => {
		const res = await request(app).post("/players");

		expect(res.statusCode).to.equal(400);
		expect(res.body).to.haveOwnProperty("error");
	});
});

describe("GET: /players", async () => {
	dbSetupWipeAtStart();

	it("should get all players", async () => {
		await request(app).post("/players").send({ username: "test" });
		const res = await request(app).get("/players");

		expect(res.statusCode).to.equal(200);
		expect(res.body.data.success).to.equal(true);
		expect(res.body.data.entities).to.be.an("array");
	});
});

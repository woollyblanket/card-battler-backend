// EXTERNAL IMPORTS		///////////////////////////////////////////
import { MongoMemoryServer } from "mongodb-memory-server";
import { expect } from "chai";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	dbClose,
	dbCloseTest,
	dbConnect,
	dbConnectTest,
} from "../helpers/db.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("helpers:db dbConnectTest dbCloseTest", async () => {
	it("should create and close a new test database connection", async () => {
		const db = await dbConnectTest();
		expect(db).to.be.instanceOf(MongoMemoryServer);
		expect(db._state).to.equal("running");
		await dbCloseTest(db);
		expect(db._state).to.equal("new");
	});
});

describe("helpers:db dbConnect dbClose", async () => {
	it("should create and close a new database connection", async () => {
		process.env.NODE_ENV = "test";
		const db = await dbConnect();
		expect(db.getClient().s.url).to.equal(process.env.MONGODB_URI_TEST);
		expect(db.getClient().s.hasBeenClosed).to.be.false;
		await dbClose(db);
		expect(db.getClient().s.hasBeenClosed).to.be.true;
	});

	it("should throw that it can't find the DB URI", async () => {
		const saved = process.env.NODE_ENV;
		process.env.NODE_ENV = "something-not-covered";
		const db = await dbConnect();
		expect(db.error).to.exist;
		process.env.NODE_ENV = saved;
	});
});

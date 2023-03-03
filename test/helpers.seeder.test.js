// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import { expect } from "chai";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { dbSetupWipeDBBeforeEach } from "../helpers/koa.tests.js";
import { getObjectId, getObjectIds, seed } from "../helpers/seeder.js";
import { dbClose } from "../helpers/db.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
describe("helpers:seeder getObjectId", async () => {
	it("should create a predictable ObjectId", async () => {
		const id = getObjectId("test").toString();

		for (let i = 0; i < 3; i++) {
			const newId = getObjectId("test").toString();
			expect(newId).to.equal(id);
		}
	});

	it("should throw an error", async () => {
		expect(() => getObjectId()).to.throw("Name cannot be empty");
	});
});

describe("helpers:seeder getObjectIds", async () => {
	it("should create a predictable ObjectIds", async () => {
		const idsToGenerate = ["test1", "test2", "test3"];
		const ids = getObjectIds(idsToGenerate);

		for (let i = 0; i < ids.length; i++) {
			const id = ids[i].toString();
			const newId = getObjectId(idsToGenerate[i]).toString();
			expect(newId).to.equal(id);
		}
	});

	it("should throw an error", async () => {
		expect(() => getObjectIds()).to.throw("Names cannot be empty");
		expect(() => getObjectIds("test")).to.throw("Names must be an array");
	});
});

describe("helpers:seeder seed", async () => {
	dbSetupWipeDBBeforeEach();

	it("should connect to the database if it isn't already connected", async () => {
		await dbClose;
		await seed("drop:all");
		expect(mongoose.connection.readyState).to.equal(1);
	});

	it("should skip seeding", async () => {
		await seed("skip");
		const cards = await mongoose.model("Card").find({}).exec();
		const decks = await mongoose.model("Deck").find({}).exec();
		const abilities = await mongoose.model("Ability").find({}).exec();

		expect(cards).to.have.lengthOf(0);
		expect(decks).to.have.lengthOf(0);
		expect(abilities).to.have.lengthOf(0);
	});

	it("should skip seeding", async () => {
		await seed();
		const cards = await mongoose.model("Card").find({}).exec();
		const decks = await mongoose.model("Deck").find({}).exec();
		const abilities = await mongoose.model("Ability").find({}).exec();

		expect(cards).to.have.lengthOf(0);
		expect(decks).to.have.lengthOf(0);
		expect(abilities).to.have.lengthOf(0);
	});

	it("should skip seeding", async () => {
		await seed("some-unknown-command");
		const cards = await mongoose.model("Card").find({}).exec();
		const characters = await mongoose.model("Character").find({}).exec();
		const enemies = await mongoose.model("Enemy").find({}).exec();

		expect(cards).to.have.lengthOf(0);
		expect(characters).to.have.lengthOf(0);
		expect(enemies).to.have.lengthOf(0);
	});

	it("should populate the database with the seed data", async () => {
		await seed("drop:all");
		const cards = await mongoose.model("Card").find({}).exec();
		const decks = await mongoose.model("Deck").find({}).exec();
		const abilities = await mongoose.model("Ability").find({}).exec();

		expect(cards).to.have.lengthOf(2);
		expect(decks).to.have.lengthOf(1);
		expect(abilities).to.have.lengthOf(2);
	});

	it("should only drop the collections specified", async () => {
		mongoose
			.model("Card")
			.create({ name: "Test", type: "buff", description: "Test" });
		await seed("drop:decks,abilities");
		const cards = await mongoose.model("Card").find({}).exec();
		const decks = await mongoose.model("Deck").find({}).exec();
		const abilities = await mongoose.model("Ability").find({}).exec();

		expect(cards).to.have.lengthOf(3);
		expect(decks).to.have.lengthOf(1);
		expect(abilities).to.have.lengthOf(2);
	});
});

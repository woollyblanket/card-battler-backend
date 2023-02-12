// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import { expect } from "chai";

// INTERNAL IMPORTS		///////////////////////////////////////////
import * as model from "../helpers/model.js";
import { dbSetupWipeDBBeforeEach } from "../helpers/tests.js";

// PRIVATE 				///////////////////////////////////////////
const schema = new mongoose.Schema({
	name: { type: String },
	number: { type: Number },
	array: [{ type: "Mixed" }],
	bool: { type: Boolean },
	links: [{ type: "ObjectId", ref: "Test2" }],
});
const Test1 = mongoose.model("Test1", schema);

const schema2 = new mongoose.Schema({
	name: { type: String },
	link: { type: "ObjectId", ref: "Test1" },
});
const Test2 = mongoose.model("Test2", schema2);

// PUBLIC 				///////////////////////////////////////////
describe("helpers:model getByID", async () => {
	dbSetupWipeDBBeforeEach();
	it("should find an entity in the db by id", async () => {
		const test = await Test1.create({ name: "test" });

		const result = await model.getByID([Test1, test._id]);
		expect(result.success).to.be.true;
	});

	it("should throw an error", async () => {
		const result = await model.getByID([Test1, 1234]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model getByField", async () => {
	dbSetupWipeDBBeforeEach();
	it("should find an entity in the db by field", async () => {
		await Test1.create({ name: "test" });

		const result = await model.getByField([Test1, "name", "test"]);
		expect(result.success).to.be.true;
	});

	it("should throw an error", async () => {
		const result = await model.getByField([Test1, "name", "1234"]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model getAll", async () => {
	dbSetupWipeDBBeforeEach();
	it("should find all entities in the db", async () => {
		await Test1.create({ name: "test" });

		const result = await model.getAll([Test1]);
		expect(result.success).to.be.true;
		expect(result.entities).to.have.lengthOf(1);
	});
});

describe("helpers:model getAllEntitiesForID", async () => {
	dbSetupWipeDBBeforeEach();
	it("should find all entities associated with another entity", async () => {
		const test = await Test1.create({ name: "test" });
		await Test2.create({ name: "test2", link: test._id });

		const result = await model.getAllEntitiesForID([
			Test1,
			test._id,
			Test2,
			"link",
		]);
		expect(result.success).to.be.true;
		expect(result.entities).to.have.lengthOf(1);
	});

	it("should throw an error", async () => {
		const result = await model.getAllEntitiesForID([
			Test1,
			"1234",
			Test2,
			"link",
		]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model resolveIDsToEntities", async () => {
	dbSetupWipeDBBeforeEach();
	it("should find all entities referenced by another", async () => {
		const test1 = await Test2.create({ name: "test1" });
		const test2 = await Test2.create({ name: "test2" });
		const test3 = await Test1.create({
			name: "test3",
			links: [test1._id, test2._id],
		});

		const result = await model.resolveIDsToEntities([
			Test1,
			test3._id,
			"links",
			Test2,
		]);
		expect(result.success).to.be.true;
		expect(result.entities).to.have.lengthOf(2);
	});

	it("should throw an error", async () => {
		const result = await model.resolveIDsToEntities([
			Test1,
			"1234",
			"links",
			Test2,
		]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model getEntityForID", async () => {
	dbSetupWipeDBBeforeEach();
	it("should find an entity that's linked by another entity", async () => {
		const test1 = await Test1.create({ name: "test1" });
		const test2 = await Test2.create({ name: "test2", link: test1._id });

		const result = await model.getEntityForID([
			Test1,
			test1._id,
			Test2,
			test2._id,
			"link",
		]);

		expect(result.success).to.be.true;
	});

	it("should throw an error", async () => {
		const result = await model.getEntityForID([
			Test1,
			"1234",
			Test2,
			"1234",
			"link",
		]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model getByIDAndUpdate", async () => {
	dbSetupWipeDBBeforeEach();
	it("should find an entity and update its name", async () => {
		const test = await Test1.create({ name: "test" });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"name",
			"test2",
			"assign",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.name).to.be.equal("test2");
	});

	it("should update a field that isn't set already", async () => {
		const test = await Test1.create({ name: "test" });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"number",
			4,
			"add",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.number).to.be.equal(4);
	});

	it("should add an element to an array", async () => {
		const test = await Test1.create({ name: "test" });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"array",
			"1234",
			"add",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.array).to.have.lengthOf(1);
	});

	it("should remove an element from an array", async () => {
		const test = await Test1.create({ name: "test", array: ["1234"] });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"array",
			"1234",
			"remove",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.array).to.have.lengthOf(0);
	});

	it("should subtract from a numerical field", async () => {
		const test = await Test1.create({ name: "test", number: 10 });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"number",
			5,
			"subtract",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.number).to.be.equal(5);
	});

	it("should handle booleans - true", async () => {
		const test = await Test1.create({ name: "test", bool: false });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"bool",
			true,
			"assign",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.bool).to.be.equal(true);
	});

	it("should handle booleans - false", async () => {
		const test = await Test1.create({ name: "test", bool: true });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"bool",
			false,
			"assign",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.bool).to.be.equal(false);
	});

	it("should throw an error - subtract only works with numbers", async () => {
		const test = await Test1.create({ name: "test", number: 10 });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"number",
			"test",
			"subtract",
		]);
		expect(result.error).to.exist;
	});
	it("should throw an error - remove only works with arrays", async () => {
		const test = await Test1.create({ name: "test", number: 10 });

		const result = await model.getByIDAndUpdate([
			Test1,
			test._id,
			"number",
			"test",
			"remove",
		]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model deleteByID", async () => {
	dbSetupWipeDBBeforeEach();
	it("should delete an entity in the db by id", async () => {
		const test = await Test1.create({ name: "test" });

		const result = await model.deleteByID([Test1, test._id]);
		expect(result.success).to.be.true;
	});

	it("should throw an error", async () => {
		const result = await model.deleteByID([Test1, 1234]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model createByField", async () => {
	dbSetupWipeDBBeforeEach();
	it("should create an entity in the db by field", async () => {
		const result = await model.createByField([Test1, "name", "test"]);
		expect(result.success).to.be.true;
		expect(result.entity.name).to.equal("test");
	});
});

describe("helpers:model createWithData", async () => {
	dbSetupWipeDBBeforeEach();
	it("should create an entity in the db with data", async () => {
		const result = await model.createWithData([Test1, { name: "test" }]);
		expect(result.success).to.be.true;
		expect(result.entity.name).to.equal("test");
	});
});

describe("helpers:model createForID", async () => {
	dbSetupWipeDBBeforeEach();
	it("should create an entity in the db with data", async () => {
		const test = await Test1.create({ name: "test" });

		const result = await model.createForID([
			Test1,
			test._id,
			Test2,
			"link",
		]);
		expect(result.success).to.be.true;
		expect(result.entity.link).to.equal(test._id);
	});

	it("should throw an error", async () => {
		const result = await model.createForID([Test1, 1234, Test2, "link"]);
		expect(result.error).to.exist;
	});
});

describe("helpers:model getModelDataTypes", async () => {
	dbSetupWipeDBBeforeEach();
	it("should get the data types present in the model", async () => {
		const result = await model.getModelDataTypes(Test1.schema.obj);
		expect(result.name.type).to.equal("string");
		expect(result.number.type).to.equal("number");
		expect(result.array.type).to.equal("mixed");
		expect(result.bool.type).to.equal("boolean");
		expect(result.links.type).to.equal("objectid");
	});
});

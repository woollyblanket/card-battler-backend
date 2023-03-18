// EXTERNAL IMPORTS		///////////////////////////////////////////

import { expect } from "chai";
import { weightedRandom } from "../helpers/algos.js";
import { closeServer } from "../helpers/koa.tests.js";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////

describe("helpers:algos weightedRandom", async () => {
	closeServer();
	it("should throw an error because the lengths don't match", async () => {
		const result = weightedRandom([1, 2, 3], [1, 1]);
		expect(result).to.be.an("error");
		expect(result.message).to.equal(
			"Items and weights must be of the same size"
		);
	});

	it("should throw an error because items is empty", async () => {
		const result = weightedRandom([], []);
		expect(result).to.be.an("error");
		expect(result.message).to.equal("Items must not be empty");
	});

	it("should generate a weighted random", async () => {
		const result = weightedRandom([1, 2, 3], [1, 2, 3]);
		expect(result).to.be.an("object");
		expect(result.item).to.be.oneOf([1, 2, 3]);
		expect(result.index).to.be.oneOf([0, 1, 2]);
	});
});

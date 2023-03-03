// see individual entity schemas in their relevant folder

import Joi from "joi";
import objectId from "joi-objectid";
import createDebugMessages from "debug";
import { OPERATIONS_PER_DATA_TYPE } from "./constants.js";

Joi.objectId = objectId(Joi);
const debug = createDebugMessages("battler:backend:helpers:joi:schema");

export const entitySchema = Joi.string().alphanum().case("lower").trim();
export const objectIdSchema = Joi.objectId();
export const usernameSchema = Joi.string().alphanum().trim().max(20);

export const getPatchSchemaForEntityName = async (name, attribute) => {
	const { joi } = await import(`../components/${name}/schema.js`);
	let relevantRule = joi.extract([attribute]);
	const allowedOperations = new Set();

	if (relevantRule.type === "alternatives") {
		// there can be many types, this can happen for object ids
		// lets gather all the operations for each of those types

		for (const match of relevantRule.describe().matches) {
			for (const operation of OPERATIONS_PER_DATA_TYPE[
				match.schema.type
			]) {
				allowedOperations.add(operation);
			}
		}
	} else {
		for (const operation of OPERATIONS_PER_DATA_TYPE[relevantRule.type]) {
			allowedOperations.add(operation);
		}
	}

	if (relevantRule.type === "array") {
		// get the schema for the items in the array (to be used to validate the value)

		// took me so long to figure this one out!
		// Joi.build() isn't documented anywhere, but found out about it via
		// https://stackoverflow.com/questions/62853354/how-to-generate-joi-validations-via-code-based-on-an-object-and-save-it-in-a-fi
		// and the linked issue: https://github.com/hapijs/joi/issues/1410

		relevantRule = Joi.alternatives().try(
			Joi.build(...relevantRule.describe().items)
		);
	}

	const schema = Joi.object({
		// make sure the attribute exists in the entity's schema
		attribute: Joi.string().valid(...Object.keys(joi.describe().keys)),
		// make sure the value matches the attribute's criteria
		value: relevantRule,
		// make sure the operation is an allowed operation
		operation: Joi.string().valid(...Array.from(allowedOperations)),
	});

	return schema;
};

export const getValidationSchemaByName = async (name) => {
	const { joi } = await import(`../components/${name}/schema.js`);
	return joi;
};

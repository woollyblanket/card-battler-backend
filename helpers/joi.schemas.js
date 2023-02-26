// see individual entity schemas in their relevant folder

import Joi from "joi";
import objectId from "joi-objectid";
import createDebugMessages from "debug";
import { OPERATIONS_PER_DATA_TYPE } from "./constants.js";

Joi.objectId = objectId(Joi);
const debug = createDebugMessages("battler:backend:helpers:joi:schema");

export const entitySchema = Joi.string().alphanum().case("lower").trim();
export const objectIdSchema = Joi.objectId();

export const getPatchSchemaForEntityName = async (name, attribute) => {
	const { joi } = await import(`../components/${name}/schema.js`);
	const relevantRule = joi.extract([attribute]);

	const schema = Joi.object({
		// make sure the attribute exists in the entity's schema
		attribute: Joi.string().valid(...Object.keys(joi.describe().keys)),
		// make sure the value matches the attribute's criteria
		value: relevantRule,
		// make sure the operation is an allowed operation
		operation: Joi.string().valid(
			...OPERATIONS_PER_DATA_TYPE[relevantRule.type]
		),
	});

	return schema;
};

export const getValidationSchemaByName = async (name) => {
	const { joi } = await import(`../components/${name}/schema.js`);
	return joi;
};

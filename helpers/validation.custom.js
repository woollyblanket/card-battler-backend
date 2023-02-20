// EXTERNAL IMPORTS		///////////////////////////////////////////
import createDebugMessages from "debug";
import mongoose from "mongoose";
import pluralize from "pluralize";
import _ from "lodash";
import { check, param } from "express-validator";
import { sentenceCase } from "change-case";

// INTERNAL IMPORTS 	///////////////////////////////////////////
import { OPERATIONS_PER_DATA_TYPE } from "./constants.js";
import { andList, orList } from "./text.js";
import { getModelFromName } from "./model.js";
import { normaliseSchema } from "./schema.js";

// PRIVATE 				///////////////////////////////////////////

const debug = createDebugMessages("battler:backend:helpers:validation:custom");

const getDataType = (thing) => {
	if (mongoose.isObjectIdOrHexString(thing)) return "objectid";
	if (_.isArray(thing)) return "array";
	if (
		thing === "true" ||
		thing === "false" ||
		thing === true ||
		thing === false
	)
		return "boolean";
	if (_.isDate(thing)) return "date";
	if (!_.isNaN(Number(thing))) return "number";
	if (_.isObject(thing)) return "object";
	if (_.isString(thing)) return "string";
	return "unknown";
};

const isRequiredIncluded = (schemaObj, body) => {
	const required = Object.keys(schemaObj).filter((key) => {
		if (schemaObj[key].required) return key;
	});

	const hasData = Object.keys(body).filter((key) => key);

	// get the intersection of the two arrays
	// will contain the values that are in both arrays
	const intersection = required.filter((value) => hasData.includes(value));

	// get the difference of the two arrays
	// will contain the values missing from the required list
	const missing = required
		.filter((x) => !intersection.includes(x))
		.concat(intersection.filter((x) => !required.includes(x)));

	return {
		result: required.length === intersection.length,
		required,
		missing,
	};
};

const isValidEnum = (schemaObj, key, value) => {
	if (schemaObj[key].enum) {
		if (!schemaObj[key].enum.includes(value)) {
			return false;
		}
	}

	return true;
};

const isValidDataType = (schemaObj, key, value) => {
	const expectedDataType = schemaObj[key].type;
	const actualDataType = getDataType(value);
	return expectedDataType === actualDataType;
};

const isInSchema = (schemaObj, item) => {
	return schemaObj[item] !== undefined;
};

const isUnique = async (model, lookup) => {
	const item = await model.findOne(lookup).exec();
	return item === undefined || item === null;
};

const messageBuilder = (rule, field, expected, actual, entity) => {
	// casting to arrays so andList and orList works as expected
	if (!Array.isArray(expected)) expected = [expected];
	if (!Array.isArray(actual)) actual = [actual];

	let message = "";
	switch (rule) {
		case "required":
			message += `Required ${pluralize(
				"field",
				expected.length
			)} missing. Required ${pluralize(
				"field",
				expected.length
			)}: ${andList.format(expected)}. Missing ${pluralize(
				"field",
				actual.length
			)}: ${andList.format(actual)}`;
			break;
		case "unique":
			message += `Field ${field} must be unique. ${sentenceCase(
				field
			)} '${andList.format(actual)}' already exists`;
			break;

		case "entity exists":
			message += `Field ${field} doesn't exist.`;
			break;

		default:
			message += `Field '${field}' expects ${entity} of ${orList.format(
				expected
			)}, but received ${entity} of '${andList.format(actual)}'`;
			break;
	}

	return message;
};

const errorParser = (messages) => {
	let error = "";

	for (let i = 0; i < messages.length; i++) {
		const message = messages[i];
		error += `Rule: ${message.rule} - `;
		error += `${message.message}`;

		if (i !== messages.length - 1) error += " | ";
	}

	return error;
};

// PUBLIC 				///////////////////////////////////////////

export const checkParamCombination = () => {
	// we care about attribute, operation, and value params
	// determine data type of value, and check does it match the data type of attribute
	// look up the operations allowed on the data type, and check if our operation matches

	return param().custom(async (params) => {
		const model = getModelFromName(params.entities);
		const normalised = normaliseSchema(model.schema.obj);

		if (!isInSchema(normalised, params.attribute))
			throw messageBuilder("entity exists", params.attribute, "", "", "");

		// check if it's the expected data type
		if (!isValidDataType(normalised, params.attribute, params.value)) {
			throw messageBuilder(
				"data type",
				params.attribute,
				normalised[params.attribute].type,
				getDataType(params.value),
				"a data type"
			);
		}

		// check if the enums are correct
		if (!isValidEnum(normalised, params.attribute, params.value)) {
			throw messageBuilder(
				"enum",
				params.attribute,
				normalised[params.attribute].enum,
				params.value,
				"a value"
			);
		}

		// look up the allowed operations for the data type
		const dataTypeOperations =
			OPERATIONS_PER_DATA_TYPE[
				normalised[params.attribute].isArray
					? "array"
					: normalised[params.attribute].type
			];

		if (!dataTypeOperations.includes(params.operation))
			throw messageBuilder(
				"operation type",
				"operation",
				dataTypeOperations,
				params.operation,
				"an operation"
			);

		// check for uniqueness
		if (normalised[params.attribute].unique) {
			const unique = await isUnique(model, {
				[params.attribute]: params.value,
			});
			if (!unique)
				throw messageBuilder(
					"unique",
					params.attribute,
					"",
					params.value,
					""
				);
		}

		return true;
	});
};

export const checkModel = (modelName) => {
	return check(modelName).custom(async (value, { req }) => {
		let messages = [];
		let name = sentenceCase(value);
		name = pluralize.singular(name);

		const model = mongoose.model(name);

		const normalised = normaliseSchema(model.schema.obj);

		// make sure the required data is included
		const requiredDetails = isRequiredIncluded(normalised, req.body);

		if (!requiredDetails.result) {
			messages.push({
				rule: "required",
				message: messageBuilder(
					"required",
					"",
					requiredDetails.required,
					requiredDetails.missing,
					""
				),
			});
		}

		for (const [key, value] of Object.entries(req.body)) {
			// skip those items not in the schema
			if (!isInSchema(normalised, key)) continue;

			// make sure anything with enums are using allowed values
			if (!isValidEnum(normalised, key, value)) {
				messages.push({
					rule: "enums",
					message: messageBuilder(
						"enums",
						key,
						normalised[key].enum,
						value,
						"a value"
					),
				});
			}

			// make sure the data types are correct
			if (!isValidDataType(normalised, key, value)) {
				messages.push({
					rule: "data type",
					message: messageBuilder(
						"data type",
						key,
						normalised[key].type,
						getDataType(value),
						"a data type"
					),
				});
			}

			// check for uniqueness
			if (normalised[key].unique) {
				const unique = await isUnique(model, { [key]: value });
				if (!unique) {
					messages.push({
						rule: "unique",
						message: messageBuilder("unique", key, "", value, ""),
					});
				}
			}
		}

		let error = errorParser(messages);

		if (messages.length !== 0) throw new Error(error);
		return true;
	});
};

export const isValidEntity = (entityName) => {
	return check(entityName).custom((value) => {
		// only allow plural paths
		// don't want people to use /card instead of /cards as
		// it's less RESTful

		if (pluralize.isSingular(value))
			throw new Error(`Invalid entity: ${value}`);

		try {
			getModelFromName(value);
		} catch (error) {
			throw new Error(`Invalid entity: ${value}`);
		}
		return true;
	});
};

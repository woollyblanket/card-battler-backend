import { check, param, validationResult } from "express-validator";
import * as constants from "./constants.js";
import createDebugMessages from "debug";
import mongoose from "mongoose";
import { constantCase, sentenceCase } from "change-case";
import pluralize from "pluralize";
import _ from "underscore";
import { SCHEMA_DATA_TYPES } from "./schema.js";
import { OPERATIONS_PER_DATA_TYPE } from "./constants.js";

const debug = createDebugMessages("backend:helpers:validation");

export const evaluateRules = (req, res, next) => {
	const result = validationResult(req);

	if (result.isEmpty()) return next();

	debug("%j", result.errors);

	res.formatter.badRequest({
		message: "Validation error",
		success: false,
		errors: result.errors,
	});
};

export const existsAndIsString = (checkName) => {
	return [
		check(checkName)
			.exists()
			.withMessage(`${checkName} must be supplied`)
			.isString()
			.withMessage(`${checkName} must be a string`)
			.trim()
			.escape(),
	];
};

export const isString = (checkName) => {
	return [
		check(checkName)
			.optional()
			.isString()
			.withMessage(`${checkName} must be a string`)
			.trim()
			.escape(),
	];
};

export const existsAndIsMongoID = (checkName) => {
	return [
		check(checkName)
			.exists()
			.withMessage(`${checkName} must be supplied`)
			.isMongoId()
			.withMessage(`${checkName} must be a MongoDB ObjectId`)
			.trim()
			.escape(),
	];
};

export const isMongoID = (checkName) => {
	return [
		check(checkName)
			.optional()
			.isMongoId()
			.withMessage(`${checkName} must be a MongoDB ObjectId`)
			.trim()
			.escape(),
	];
};

export const existsAndIsOneOfList = (checkName, list) => {
	return [
		check(checkName)
			.exists()
			.withMessage(`${checkName} must be supplied`)
			.isIn(list)
			.withMessage(
				`${checkName} must be one of the following values: ${list.join(
					", "
				)}`
			)
			.trim()
			.escape(),
	];
};

export const isNumber = (checkName) => {
	return [
		check(checkName)
			.optional()
			.isNumeric()
			.withMessage(`${checkName} must be a number`)
			.trim()
			.escape(),
	];
};

export const existsAndIsAlphanumeric = (checkName) => {
	return [
		check(checkName)
			.exists()
			.withMessage(`${checkName} must be supplied`)
			.isAlphanumeric()
			.withMessage(`${checkName} must be alphanumeric`)
			.trim()
			.escape(),
	];
};

export const isArrayOfObjectIDs = (checkName) => {
	return [
		check(checkName)
			.optional()
			.isArray()
			.withMessage(`${checkName} must be an array`),
		check(`${checkName}.*`)
			.optional()
			.isMongoId()
			.withMessage(`${checkName} must contain Mongo ObjectIds`),
	];
};

export const isUniqueByField = (checkName, mongooseModel) => {
	return [
		check(checkName).custom(async (value) => {
			const item = await mongooseModel
				.findOne({ [checkName]: value })
				.exec();

			if (item) throw `${value} already exists`;
			return true;
		}),
	];
};

export const checkIfEnumerated = (checkName, checkValue, lookup = "") => {
	// if the lookup isn't supplied, use the checkValue to lookup
	if (lookup === "") lookup = checkValue;
	// these are stored in plural form, so pluralising
	lookup = pluralize(lookup);
	// these are stored as constants, so changing case
	lookup = constantCase(lookup);

	if (constants[lookup] === undefined)
		throw `Invalid lookup. ${lookup} doesn't exist`;
	return [
		check(checkName).custom((value, { req }) => {
			if (value === checkValue) {
				// the only operations allowed are: assign
				if (req.params.operation !== "assign") {
					throw `Invalid operation. When updating the ${checkValue}, the operation must be 'assign'`;
				}
				// the only values allowed are in the valid list
				if (constants[lookup].includes(req.params.value) === false) {
					throw `Invalid value. When updating the ${checkValue}, the valid values are: ${constants[
						lookup
					].join(", ")}`;
				}
			}
			return true;
		}),
	];
};

const getDataType = (thing) => {
	if (mongoose.isObjectIdOrHexString(thing)) return "objectid";
	if (_.isArray(thing)) return "array";
	if (thing === "true" || thing === "false") return "boolean";
	if (_.isDate(thing)) return "date";
	if (!_.isNaN(Number(thing))) return "number";
	if (_.isObject(thing)) return "object";
	if (_.isString(thing)) return "string";
	return "unknown";
};

export const checkParamCombination = (schema) => {
	// we care about attribute, operation, and value params
	// determine data type of value, and check does it match the data type of attribute
	// look up the operations allowed on the data type, and check if our operation matches

	// sanitize, just in case
	schema = pluralize.singular(schema).toLocaleLowerCase();

	return [
		param().custom((params) => {
			// get value data type
			const valueDataType = getDataType(params.value);

			const expectedDataType =
				SCHEMA_DATA_TYPES[schema][params.attribute].type;
			const isArray =
				SCHEMA_DATA_TYPES[schema][params.attribute].array || false;

			// check if it's the expected data type
			if (valueDataType !== expectedDataType)
				throw `Unexpected data type. ${sentenceCase(
					params.attribute
				)} expects a data type of ${expectedDataType} but received a data type of ${valueDataType}`;

			const formatter = new Intl.ListFormat("en", {
				style: "long",
				type: "disjunction",
			});

			// look up the allowed operations for the data type
			const dataTypeOperations =
				OPERATIONS_PER_DATA_TYPE[isArray ? "array" : expectedDataType];
			if (!dataTypeOperations.includes(params.operation))
				throw `Unexpected operation. ${sentenceCase(
					params.attribute
				)} expects an operation of either ${formatter.format(
					dataTypeOperations
				)} but received an operation of ${params.operation}`;

			return true;
		}),
	];
};

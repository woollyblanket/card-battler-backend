import { check, validationResult } from "express-validator";
import {
	validAttributes as gameAttributes,
	validDataTypes as gameDataTypes,
} from "../components/games/model.js";
import {
	validAttributes as abilityAttributes,
	validDataTypes as abilityDataTypes,
	validAbilityTypes,
} from "../components/abilities/model.js";
import {
	validAttributes as playerAttributes,
	validDataTypes as playerDataTypes,
} from "../components/players/model.js";
import {
	validAttributes as characterAttributes,
	validDataTypes as characterDataTypes,
} from "../components/characters/model.js";
import {
	validAttributes as cardAttributes,
	validDataTypes as cardDataTypes,
	validCardTypes,
} from "../components/cards/model.js";
import {
	validAttributes as deckAttributes,
	validDataTypes as deckDataTypes,
} from "../components/decks/model.js";
import createDebugMessages from "debug";
import mongoose from "mongoose";

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

export const validStatuses = ["new", "active", "archived", "paused"];

export const validAttributes = {
	game: gameAttributes,
	player: playerAttributes,
	card: cardAttributes,
	character: characterAttributes,
	deck: deckAttributes,
	ability: abilityAttributes,
};
export const validDataTypes = {
	game: gameDataTypes,
	player: playerDataTypes,
	card: cardDataTypes,
	characterDataTypes: characterDataTypes,
	deck: deckDataTypes,
	ability: abilityDataTypes,
};
export const validOperations = ["add", "subtract", "assign", "remove"];

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

export const checkIfStatus = (checkName) => {
	return [
		check(checkName).custom((value, { req }) => {
			if (value === "status") {
				// the only operations allowed are: assign
				if (req.params.operation !== "assign") {
					throw `Invalid operation. When updating the status, the operation must be 'assign'`;
				}
				// the only values allowed are in the valid status list
				if (validStatuses.includes(req.params.value) === false) {
					throw `Invalid value. When updating the status, the valid values are: ${validStatuses.join(
						", "
					)}`;
				}
			}
			return true;
		}),
	];
};

export const checkIfAbilityType = (checkName) => {
	return [
		check(checkName).custom((value, { req }) => {
			if (value === "type") {
				// the only operations allowed are: assign
				if (req.params.operation !== "assign") {
					throw `Invalid operation. When updating the ability type, the operation must be 'assign'`;
				}
				// the only values allowed are in the valid status list
				if (validAbilityTypes.includes(req.params.value) === false) {
					throw `Invalid value. When updating the ability type, the valid values are: ${validAbilityTypes.join(
						", "
					)}`;
				}
			}
			return true;
		}),
	];
};

export const checkIfCardType = (checkName) => {
	return [
		check(checkName).custom((value, { req }) => {
			if (value === "type") {
				// the only operations allowed are: assign
				if (req.params.operation !== "assign") {
					throw `Invalid operation. When updating the card type, the operation must be 'assign'`;
				}
				// the only values allowed are in the valid status list
				if (validCardTypes.includes(req.params.value) === false) {
					throw `Invalid value. When updating the card type, the valid values are: ${validCardTypes.join(
						", "
					)}`;
				}
			}
			return true;
		}),
	];
};

export const checkIfAllowedDataTypeAndOperation = (checkName, dataTypes) => {
	return [
		check(checkName).custom((name, { req }) => {
			let val;
			let isObjectID = false;
			if (mongoose.isObjectIdOrHexString(req.params.value)) {
				val = req.params.value;
				isObjectID = true;
			} else {
				// check if we have some allowed symbols. If so, treat this as a string not a number
				// this is for the abilities entity, which can have stuff like {"strength": "+4"}
				const allowedSymbols = ["+", "-", "*", "/"];
				let hasAllowedSymbol = false;
				allowedSymbols.forEach((value) => {
					if (req.params.value.includes(value))
						hasAllowedSymbol = true;
				});
				if (hasAllowedSymbol) {
					val = req.params.value;
				} else {
					val = parseInt(req.params.value);
					if (isNaN(val)) val = req.params.value;
					if (val === "true") val = true;
					if (val === "false") val = false;
				}
			}

			if (!dataTypes[name].array && req.params.operation === "remove")
				throw `Invalid operation. Operation 'remove' only allowed for arrays. Attribute '${name}' is of type '${dataTypes[name].type}'`;

			// object ids are typeof string, so need to handle them separately
			if (isObjectID) {
				if (dataTypes[name].type !== "objectid")
					throw `Invalid data type. Attribute '${name}' expects value '${val}' to be of type '${dataTypes[name].type}'`;
			} else {
				if (dataTypes[name].type === "objectid")
					throw `Invalid data type. Attribute '${name}' expects value '${val}' to be of type 'objectid'`;
				if (dataTypes[name].type !== typeof val)
					throw `Invalid data type. Attribute '${name}' expects value '${val}' to be of type '${dataTypes[name].type}'`;
			}

			return true;
		}),
	];
};

import { body, param, check, validationResult } from "express-validator";
import {
	validAttributes as gameAttributes,
	validDataTypes as gameDataTypes,
} from "../components/games/model.js";
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
} from "../components/cards/model.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:helper:validation");

export const evaluateRules = (req, res, next) => {
	const result = validationResult(req);

	if (result.isEmpty()) return next();

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
};
export const validDataTypes = {
	game: gameDataTypes,
	player: playerDataTypes,
	card: cardDataTypes,
	characterDataTypes: characterDataTypes,
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

export const existsAndIsNumber = (checkName) => {
	return [
		check(checkName)
			.exists()
			.withMessage(`${checkName} must be supplied`)
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
			.withMessage(`${checkName} must be a number`)
			.trim()
			.escape(),
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
				if (validStatuses.includes(req.params.amount) === false) {
					throw `Invalid value. When updating the status, the valid values are: ${validStatuses.join(
						", "
					)}`;
				}
			}
			return true;
		}),
	];
};

export const checkIfAllowedDataType = (checkName, dataTypes) => {
	return [
		check(checkName).custom((value, { req }) => {
			let amount = parseInt(req.params.amount);
			console.log("typeof amount :>> ", typeof amount);

			console.log("amount :>> ", amount);
			if (isNaN(amount)) amount = req.params.amount;

			console.log("amount :>> ", amount);
			console.log("typeof amount :>> ", typeof amount);
			console.log("dataTypes[value].type :>> ", dataTypes[value].type);

			if (dataTypes[value].type !== typeof amount)
				throw `Invalid data type. Attribute '${value}' expects value '${amount}' to be of type '${dataTypes[value].type}'`;
			return true;
		}),
	];
};

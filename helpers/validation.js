import { body, param, check, validationResult } from "express-validator";
import { validAttributes as gameAttributes } from "../components/games/model.js";
import { validAttributes as playerAttributes } from "../components/players/model.js";
import { validAttributes as characterAttributes } from "../components/characters/model.js";
import { validAttributes as cardAttributes } from "../components/cards/model.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:helper:validation");

export const evaluateRules = (req, res, next) => {
	const result = validationResult(req);

	if (result.isEmpty()) return next();

	res.formatter.badRequest(result.errors);
};

export const validStatuses = ["new", "active", "archived", "paused"];
export const validAttributes = {
	game: gameAttributes,
	player: playerAttributes,
	card: cardAttributes,
	character: characterAttributes,
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

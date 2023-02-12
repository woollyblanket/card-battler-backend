// EXTERNAL IMPORTS		///////////////////////////////////////////
import createDebugMessages from "debug";
import { check } from "express-validator";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:helpers:validation");

// PUBLIC 				///////////////////////////////////////////
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
	return check(checkName)
		.exists()
		.withMessage(`${checkName} must be supplied`)
		.isMongoId()
		.withMessage(`${checkName} must be a MongoDB ObjectId`)
		.trim()
		.escape();
};

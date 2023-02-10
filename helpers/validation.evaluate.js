// EXTERNAL IMPORTS		///////////////////////////////////////////
import createDebugMessages from "debug";
import { validationResult } from "express-validator";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:helpers:validation");

// PUBLIC 				///////////////////////////////////////////
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

export const validate = (validations) => {
	return async (req, res, next) => {
		for (let validation of validations) {
			const result = await validation.run(req);
			if (result.errors.length) break;
		}

		const result = validationResult(req);
		if (result.isEmpty()) {
			return next();
		}

		debug("%j", result.errors);

		res.formatter.badRequest({
			message: "Validation error",
			success: false,
			errors: result.errors,
		});
	};
};

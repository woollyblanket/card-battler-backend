// EXTERNAL IMPORTS		///////////////////////////////////////////
import { csrfSync } from "csrf-sync";
import createDebugMessages from "debug";
import * as dotenv from "dotenv";
dotenv.config();

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////

const debug = createDebugMessages("battler:backend:middleware:csrf");

// PUBLIC 				///////////////////////////////////////////
export const {
	invalidCsrfTokenError,
	generateToken,
	csrfSynchronisedProtection,
} = csrfSync();

export const csrfErrorHandler = (error, req, res, next) => {
	if (error === invalidCsrfTokenError) {
		debug(error);
		res.formatter.forbidden({
			message: `CSRF error: ${error.message}`,
			success: false,
		});
	} else {
		next();
	}
};

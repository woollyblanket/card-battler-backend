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

export const csrfErrorHandler = (err, req, res, next) => {
	if (err === invalidCsrfTokenError) {
		debug(err);
		res.formatter.forbidden({
			message: `CSRF error: ${err.message}`,
			success: false,
		});
	} else {
		next(err);
	}
};

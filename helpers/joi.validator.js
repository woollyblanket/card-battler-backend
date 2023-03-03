import createDebugMessages from "debug";

import { createErrorResponse } from "./koa.actions.js";
const debug = createDebugMessages("battler:backend:helpers:joi:validator");

export const getErrorResponse = async (
	dataToCheck,
	schemaToCheckAgainst,
	errorStatus,
	ctx
) => {
	try {
		const result = await schemaToCheckAgainst.validateAsync(dataToCheck, {
			abortEarly: false,
		});
		if (result.error) throw result.error;
	} catch (error) {
		debug(error);

		return createErrorResponse(ctx, errorStatus, error);
	}
};

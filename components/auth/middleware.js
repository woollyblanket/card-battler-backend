import _ from "lodash";
import { UNPROTECTED_ROUTES } from "../../helpers/constants.js";
import { UnauthorisedError } from "../../helpers/errors.js";
import { createErrorResponse } from "../../helpers/koa.actions.js";

export const authenticated = async (ctx, next) => {
	// there are certain paths and methods that we don't want to protect
	if (_.find(UNPROTECTED_ROUTES, { path: ctx.path, method: ctx.method })) {
		return next();
	}

	if (ctx.isAuthenticated()) {
		return next();
	} else {
		return createErrorResponse(
			ctx,
			401,
			new UnauthorisedError(`Path: ${ctx.path}`)
		);
	}
};

import _ from "lodash";
import { UNPROTECTED_ROUTES } from "../../helpers/constants.js";

export const authenticated = async (ctx, next) => {
	// there are certain paths and methods that we don't want to protect
	if (_.find(UNPROTECTED_ROUTES, { path: ctx.path, method: ctx.method })) {
		return next();
	}

	if (ctx.isAuthenticated()) {
		return next();
	} else {
		ctx.throw(401);
		return next();
	}
};

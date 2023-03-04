export const authenticated = async (ctx, next) => {
	if (ctx.isAuthenticated()) {
		return next();
	} else {
		ctx.throw(401);
		return next();
	}
};

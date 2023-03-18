export const devcheck = async (ctx, next) => {
	await next();

	/* c8 ignore start */
	if (process.env.NODE_ENV === "development") {
		ctx.assert.equal(
			"object",
			typeof ctx.body,
			500,
			"Dev Error: ctx.body needs to be an object"
		);
	}
	/* c8 ignore stop */
};

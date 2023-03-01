import createDebugMessages from "debug";

const debug = createDebugMessages("battler:backend:helpers:actions");

export const doAction = async (action, params, status, ctx) => {
	const result = await action(params);

	if (result.error) {
		debug(result.error);

		return createErrorResponse(ctx, 400, result.error);
	} else {
		ctx.body = result;
		ctx.status = status;
		return ctx;
	}
};

export const createErrorResponse = (ctx, status, error = "") => {
	if (status === 404 || error.code === "NOT_FOUND") {
		ctx.body = {
			message: "Not Found",
			success: false,
		};
		ctx.status = 404;
		return ctx;
	} else {
		ctx.body = {
			message: error.name,
			success: false,
			error: error.message,
		};
		ctx.status = status;
		return ctx;
	}
};

import createDebugMessages from "debug";
const debug = createDebugMessages("battler:backend:helpers:joi:validator");

export const getErrorResponse = (
	dataToCheck,
	schemaToCheckAgainst,
	errorStatus,
	ctx
) => {
	const result = schemaToCheckAgainst.validate(dataToCheck, {
		abortEarly: false,
	});

	if (result.error) {
		debug(result.error);
		ctx.status = errorStatus;
		ctx.body = {
			message: `${result.error.name}: ${result.error.message}`,
			success: false,
			...result,
		};
		return ctx;
	}
};

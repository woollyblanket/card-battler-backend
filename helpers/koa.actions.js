import { getModelFromName } from "./model.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("battler:backend:helpers:crud");

export const doAction = async (entity, action, params, status, ctx) => {
	const model = getModelFromName(entity);
	const result = await action([model, ...params]);
	console.log("result :>> ", result);
	if (result.error) {
		debug(result);
		ctx.body = {
			message: result.error.message,
			success: false,
		};
		ctx.status = 400;
	} else {
		ctx.body = result;
		ctx.status = status;
	}
	return ctx;
};

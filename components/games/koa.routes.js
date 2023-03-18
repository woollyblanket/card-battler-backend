// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { newGame } from "./model.js";
import { getErrorResponse } from "../../helpers/joi.validator.js";
import { objectIdSchema } from "../../helpers/joi.schemas.js";
import { doAction } from "../../helpers/koa.actions.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:games:routes");
export const games = new Router();

// PUBLIC 				///////////////////////////////////////////

games.param("id", async (id, ctx, next) => {
	return (await getErrorResponse(id, objectIdSchema, 404, ctx)) || next();
});

games.post("/", async (ctx, next) => {
	return await doAction(
		newGame,
		[ctx.request.body.playerID, ctx.request.body.characterID],
		201,
		ctx
	);
});

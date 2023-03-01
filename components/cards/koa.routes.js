// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Card, playCard } from "./model.js";
import { getErrorResponse } from "../../helpers/joi.validator.js";
import { objectIdSchema } from "../../helpers/joi.schemas.js";
import { doAction } from "../../helpers/koa.actions.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:cards:routes");
export const cards = new Router();

// PUBLIC 				///////////////////////////////////////////

});

cards.post("/:id/play", async (ctx, next) => {
		ctx.request.body.gameID,
		objectIdSchema,
		400,
		ctx
	);

	if (errorResponse) {
		// problems
		return errorResponse;
	} else {
		// all good
		return await doAction(
			playCard,
			[Card, ctx.request.body.gameID],
			200,
			ctx
		);
	}
});

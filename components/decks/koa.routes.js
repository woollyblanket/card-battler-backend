// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Card } from "../cards/model.js";
import { getErrorResponse } from "../../helpers/joi.validator.js";
import { objectIdSchema } from "../../helpers/joi.schemas.js";
import { doAction } from "../../helpers/koa.actions.js";
import { resolveIDsToEntities } from "../../helpers/model.js";
import { Deck } from "./model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:decks:routes");
export const decks = new Router();

// PUBLIC 				///////////////////////////////////////////

});

decks.get("/:id/cards", async (ctx, next) => {
	return await doAction(
		resolveIDsToEntities,
		[Deck, ctx.params.id, "cards", Card],
		200,
		ctx
	);
});

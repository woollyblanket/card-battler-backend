// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Deck } from "./model.js";
import { Card } from "../cards/model.js";
import { getErrorResponse } from "../../helpers/joi.validator.js";
import { objectIdSchema } from "../../helpers/joi.schemas.js";
import { doAction } from "../../helpers/koa.actions.js";
import { resolveIDsToEntities } from "../../helpers/model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:decks:routes");
export const decks = new Router();

debug(Deck);

// PUBLIC 				///////////////////////////////////////////

decks.param("id", (id, ctx, next) => {
	return getErrorResponse(id, objectIdSchema, 404, ctx) || next();
});

decks.get("/:id/cards", async (ctx, next) => {
	return await doAction(
		"cards",
		resolveIDsToEntities,
		[ctx.request.body.deckID, "cards", Card],
		200,
		ctx
	);
});

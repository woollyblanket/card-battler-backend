// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { getErrorResponse } from "../../helpers/joi.validator.js";
import { objectIdSchema, usernameSchema } from "../../helpers/joi.schemas.js";
import { doAction } from "../../helpers/koa.actions.js";
import {
	createForID,
	getAllEntitiesForID,
	getByField,
	getEntityForID,
} from "../../helpers/model.js";
import { Game } from "../games/model.js";
import { Player } from "./model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:players:routes");
export const players = new Router();

// PUBLIC 				///////////////////////////////////////////

});

});

});

players.get("/username/:username", async (ctx, next) => {
	return await doAction(
		getByField,
		[Player, "username", ctx.params.username],
		200,
		ctx
	);
});

players.get("/:id/games", async (ctx, next) => {
	return await doAction(
		getAllEntitiesForID,
		[Player, ctx.params.id, Game, "player"],
		200,
		ctx
	);
});

players.post("/:id/games", async (ctx, next) => {
	return await doAction(
		createForID,
		[Player, ctx.params.id, Game, "player"],
		200,
		ctx
	);
});

players.get("/:id/games/:gameID", async (ctx, next) => {
	return await doAction(
		getEntityForID,
		[Player, ctx.params.id, Game, ctx.params.gameID, "player"],
		200,
		ctx
	);
});

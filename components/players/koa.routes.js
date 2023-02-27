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

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:players:routes");
export const players = new Router();

// PUBLIC 				///////////////////////////////////////////

players.param("id", (id, ctx, next) => {
	return getErrorResponse(id, objectIdSchema, 404, ctx) || next();
});

players.param("username", (username, ctx, next) => {
	return getErrorResponse(username, usernameSchema, 404, ctx) || next();
});

players.param("gameID", (gameID, ctx, next) => {
	return getErrorResponse(gameID, objectIdSchema, 404, ctx) || next();
});

players.get("/username/:username", async (ctx, next) => {
	return await doAction(
		"player",
		getByField,
		["username", ctx.params.username],
		200,
		ctx
	);
});

players.get("/:id/games", async (ctx, next) => {
	return await doAction(
		"player",
		getAllEntitiesForID,
		[ctx.params.id, Game, "player"],
		200,
		ctx
	);
});

players.post("/:id/games", async (ctx, next) => {
	return await doAction(
		"player",
		createForID,
		[ctx.params.id, Game, "player"],
		200,
		ctx
	);
});

players.get("/:id/games/:gameID", async (ctx, next) => {
	return await doAction(
		"player",
		getEntityForID,
		[ctx.params.id, Game, ctx.params.gameID, "player"],
		200,
		ctx
	);
});

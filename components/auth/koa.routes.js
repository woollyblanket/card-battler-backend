// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";
import { passport } from "./setup.js";
import { buildResponse } from "../../helpers/model.js";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:auth:routes");
export const auth = new Router();

// PUBLIC 				///////////////////////////////////////////

auth.post("/login", async (ctx, next) => {
	await passport.authenticate("local", async (err, player, info) => {
		if (err) throw err;
		ctx.body = buildResponse(`Player logged in`, true, {
			...player,
			...info,
		});
		if (player) await ctx.login(player);
	})(ctx, next);
	await next();
});

auth.post("/logout", async (ctx, next) => {
	const player = ctx.session.passport.user;
	ctx.body = buildResponse(`Player logged out`, true, player);
	await ctx.logout();
});


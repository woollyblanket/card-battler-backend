// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";
import { passport } from "./setup.js";
import { buildResponse } from "../../helpers/model.js";
import { createErrorResponse } from "../../helpers/koa.actions.js";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:auth:routes");
export const auth = new Router();

// PUBLIC 				///////////////////////////////////////////

auth.post("/login", async (ctx, next) => {
	await passport.authenticate("local", async (err, player, info) => {
		if (err) throw err;

		if (player) {
			ctx.body = buildResponse(`Player logged in`, true, {
				...player,
				...info,
			});
			await ctx.login(player);
		} else {
			return createErrorResponse(ctx, 200, {
				name: "Login error",
				message: `Couldn't log in`,
			});
		}
	})(ctx, next);
	await next();
});

auth.post("/logout", async (ctx, next) => {
	const player = ctx.session.passport.user;
	ctx.body = buildResponse(`Player logged out`, true, player);
	await ctx.logout();
});

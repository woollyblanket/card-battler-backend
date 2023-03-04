// EXTERNAL IMPORTS		///////////////////////////////////////////

import createDebugMessages from "debug";
import Router from "@koa/router";
import { passport } from "./setup.js";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:auth:routes");
export const auth = new Router();

// PUBLIC 				///////////////////////////////////////////

auth.post("/login", async (ctx, next) => {
	await passport.authenticate("local", async (err, player, info) => {
		if (err) throw err;
		ctx.body = { player, info };
		if (player) await ctx.login(player);
	})(ctx, next);
	await next();
});

auth.post("/logout", async (ctx, next) => {
	await ctx.logout();
	ctx.body = { blah: "blah" };
});


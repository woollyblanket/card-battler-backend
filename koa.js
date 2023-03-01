import Koa from "koa";
import * as dotenv from "dotenv";
dotenv.config();
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import helmet from "koa-helmet";
import createDebugMessages from "debug";
import cors from "@koa/cors";
import Router from "@koa/router";
import { crud } from "./helpers/crud.js";
import { dbConnect } from "./helpers/db.js";
import { seed } from "./helpers/seeder.js";
import { cards } from "./components/cards/koa.routes.js";
import { decks } from "./components/decks/koa.routes.js";
import { games } from "./components/games/koa.routes.js";
import { players } from "./components/players/koa.routes.js";
import { Ability } from "./components/abilities/model.js";
import { Card } from "./components/cards/model.js";
import { Character } from "./components/characters/model.js";
import { Deck } from "./components/decks/model.js";
import { Enemy } from "./components/enemies/model.js";
import { Game } from "./components/games/model.js";
import { Player } from "./components/players/model.js";
import { createErrorResponse } from "./helpers/koa.actions.js";

const debug = createDebugMessages("battler:backend:koa");

// debugging here just to make sure that the schemas are loaded
debug(Ability);
debug(Card);
debug(Character);
debug(Deck);
debug(Enemy);
debug(Game);
debug(Player);

const v1Prefix = "/v1";

export const app = new Koa();
const root = new Router();

const router = new Router({
	prefix: v1Prefix,
});

app.use(bodyParser());
app.use(logger());
app.use(helmet());
app.use(
	cors({
		origin: true,
	})
);

// middleware
app.use(async (ctx, next) => {
	await next();

	if (process.env.NODE_ENV === "development") {
		ctx.assert.equal(
			"object",
			typeof ctx.body,
			500,
			"Dev Error: ctx.body needs to be an object"
		);
	}
});

/* c8 ignore start */
if (process.env.NODE_ENV !== "test") {
	// there's a few things that aren't applicable to the test environment
	await dbConnect();
	await seed(process.env.DATA_SEED);
}
/* c8 ignore stop */

// make sure anything that doesn't have the version prefix gives a not found response
root.all(/^(?!\/?v1).+$/, (ctx) => {
	return createErrorResponse(ctx, 404);
});

router.all("/", (ctx) => {
	return createErrorResponse(ctx, 404);
});

router.get(`/500`, () => {
	// using in tests to make sure 500 errors are being handled
	// having this at the start so my generic crud doesn't catch it
	throw new Error("BROKEN");
});

router.use("/games", games.routes());

// anything above this overwrites the default crud
router.use(crud.routes());
router.use("/cards", cards.routes());
router.use("/decks", decks.routes());
router.use("/players", players.routes());

app.use(root.routes());
app.use(router.routes()).use(router.allowedMethods());

app.on("error", (err, ctx) => {
	debug(err);
	return createErrorResponse(ctx, 500, err);
});

debug("listening on port:>> ", process.env.PORT || 3000);
export const server = app.listen(process.env.PORT || 3000);

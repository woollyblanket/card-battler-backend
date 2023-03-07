// EXTERNAL IMPORTS		///////////////////////////////////////////
import Koa from "koa";
import * as dotenv from "dotenv";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import helmet from "koa-helmet";
import createDebugMessages from "debug";
import cors from "@koa/cors";
import Router from "@koa/router";
import session from "koa-session";
import redisStore from "koa-redis";
import { RateLimit } from "koa2-ratelimit";

// INTERNAL IMPORTS		///////////////////////////////////////////

// helpers
import { crud } from "./helpers/crud.js";
import { dbConnect } from "./helpers/db.js";
import { createErrorResponse } from "./helpers/koa.actions.js";
import { seed } from "./helpers/seeder.js";

// routes
import { cards } from "./components/cards/koa.routes.js";
import { decks } from "./components/decks/koa.routes.js";
import { games } from "./components/games/koa.routes.js";
import { players } from "./components/players/koa.routes.js";

// models
import { Ability } from "./components/abilities/model.js";
import { Card } from "./components/cards/model.js";
import { Character } from "./components/characters/model.js";
import { Deck } from "./components/decks/model.js";
import { Enemy } from "./components/enemies/model.js";
import { Game } from "./components/games/model.js";
import { Player } from "./components/players/model.js";

// middleware
import { devcheck } from "./middleware/devcheck.js";
import { sessionViews } from "./middleware/session.js";
import { authenticated } from "./components/auth/middleware.js";
import { auth } from "./components/auth/koa.routes.js";
import { passportInit, passportSession } from "./components/auth/setup.js";

dotenv.config();

// PRIVATE 				///////////////////////////////////////////

const debug = createDebugMessages("battler:backend:koa");

// debugging here just to make sure that the schemas are loaded
debug(Ability);
debug(Card);
debug(Character);
debug(Deck);
debug(Enemy);
debug(Game);
debug(Player);

const root = new Router();
const v1Router = new Router({
	prefix: "/v1",
});

const limiter = RateLimit.middleware({
	interval: { min: 15 },
	max: 100,
});

const sessionConfig = {
	// setting same site to combat csrf
	sameSite: "strict",
	store: redisStore({ url: process.env.REDIS_URL }),
	maxAge: 24 * 60 * 60 * 1000,
};

// stored as a stringified array
const secret = JSON.parse(process.env.SESSION_SECRET.replaceAll("\\", ""));

// PUBLIC 				///////////////////////////////////////////
export const app = new Koa();

app.keys = secret;
app.use(session(sessionConfig, app));
app.use(bodyParser());
app.use(logger());
app.use(helmet());
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);

app.use(passportInit);
app.use(passportSession);

// middleware
app.use(devcheck);
app.use(sessionViews);
// protect all endpoints by default
// exceptions are handled in the middleware itself
app.use(authenticated);

/* c8 ignore start */
if (process.env.NODE_ENV !== "test") {
	// there's a few things that aren't applicable to the test environment
	await dbConnect();
	await seed(process.env.DATA_SEED);
	app.use(limiter);
}
/* c8 ignore stop */

// make sure anything that doesn't have the version prefix gives a not found response
root.all(/^(?!\/?v1).+$/, (ctx) => {
	return createErrorResponse(ctx, 404);
});

v1Router.all("/", (ctx) => {
	return createErrorResponse(ctx, 404);
});

v1Router.get(`/500`, () => {
	// using in tests to make sure 500 errors are being handled
	// having this at the start so my generic crud doesn't catch it
	throw new Error("BROKEN");
});

v1Router.use("/auth", auth.routes());
v1Router.use("/games", games.routes());

// anything above this overwrites the default crud
v1Router.use(crud.routes());
v1Router.use("/cards", cards.routes());
v1Router.use("/decks", decks.routes());
v1Router.use("/players", players.routes());

app.use(root.routes());
app.use(v1Router.routes()).use(v1Router.allowedMethods());

app.on("error", (err, ctx) => {
	debug(err);
	return createErrorResponse(ctx, 500, err);
});

debug("listening on port:>> ", process.env.PORT || 3000);
export const server = app.listen(process.env.PORT || 3000);

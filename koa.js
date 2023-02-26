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

const app = new Koa();
const router = new Router({
	prefix: "/v1",
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

	ctx.assert.equal(
		"object",
		typeof ctx.body,
		500,
		"some dev did something wrong"
	);
});

/* c8 ignore start */
if (process.env.NODE_ENV !== "test") {
	// there's a few things that aren't applicable to the test environment
	await dbConnect();
	await seed(process.env.DATA_SEED);
}
/* c8 ignore stop */

router.use(crud.routes(), cards.routes());

app.use(router.routes()).use(router.allowedMethods());

app.on("error", (err, ctx) => {
	// console.error("server error", err, ctx);
	const debug = createDebugMessages("battler:backend:koa");
	debug(err);
});

// app.on("error", async (err) => {
// 	if (process.env.NODE_ENV !== "test") {
// 		console.log("sent error %s to the cloud", err.message);
// 		console.log(err);
// 	}
// });

app.listen(3000);

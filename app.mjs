// EXTERNAL IMPORTS		///////////////////////////////////////////
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import createDebugMessages from "debug";
import bodyParser from "body-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { responseEnhancer } from "express-response-formatter";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { dbConnect } from "./helpers/db.js";
import { seed } from "./helpers/seeder.js";
import crud from "./helpers/routes.js";
import games from "./components/games/routes.js";
import players from "./components/players/routes.js";
import decks from "./components/decks/routes.js";
import cards from "./components/cards/routes.js";
import abilities from "./components/abilities/routes.js";
import characters from "./components/characters/routes.js";
import enemies from "./components/enemies/routes.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:app");

const app = express();
app.disable("x-powered-by");
app.use(helmet());

const main = async () => {
	if (process.env.NODE_ENV !== "test") {
		await dbConnect();
		await seed(process.env.DATA_SEED);
	}
};

const corsOptions = {
	origin: true,
};

// PUBLIC 				///////////////////////////////////////////
main().catch((err) => console.log(err));

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	ExpressMongoSanitize({
		onSanitize: ({ req, key }) => {
			debug(`This request[${key}] has been sanitised %O`, req[key]);
		},
	})
);
app.use(cookieParser());
app.use(
	express.static(
		path.join(path.dirname(fileURLToPath(import.meta.url)), "public")
	)
);

app.use(responseEnhancer());

// ROUTES 				///////////////////////////////////////////

app.use("/500", () => {
	// using in tests to make sure 500 errors are being handled
	// having this at the start so my generic crud doesn't catch it
	throw new Error("BROKEN");
});
app.use("/", crud);
app.use("/games", games);
app.use("/players", players);
app.use("/decks", decks);
app.use("/cards", cards);
app.use("/abilities", abilities);
app.use("/characters", characters);
app.use("/enemies", enemies);

// ERRORS 				///////////////////////////////////////////
app.use((err, req, res, next) => {
	const debug = createDebugMessages("battler:backend:error");
	debug(err.stack);
	next(err);
});

app.use((err, req, res, next) => {
	res.formatter.serverError({ message: err.message, success: false });
});

// 404	 				///////////////////////////////////////////
app.use((req, res, next) => {
	res.formatter.notFound({ message: "Not found", success: false });
});

export { app };

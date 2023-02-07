import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import createDebugMessages from "debug";

import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import cors from "cors";
import { responseEnhancer } from "express-response-formatter";

import games from "./components/games/routes.js";
import players from "./components/players/routes.js";
import decks from "./components/decks/routes.js";
import cards from "./components/cards/routes.js";
import abilities from "./components/abilities/routes.js";
import characters from "./components/characters/routes.js";
import enemies from "./components/enemies/routes.js";

import { dbConnect } from "./helpers/db.js";

import { seed } from "./helpers/seeder.js";

var app = express();

const main = async () => {
	if (process.env.NODE_ENV !== "test") {
		await dbConnect();
		await seed(process.env.DATA_SEED);
	}
};

main().catch((err) => console.log(err));

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	express.static(
		path.join(path.dirname(fileURLToPath(import.meta.url)), "public")
	)
);

app.use(responseEnhancer());

// --------------------------------------------------------
// Routes
// --------------------------------------------------------
app.use("/games", games);
app.use("/players", players);
app.use("/decks", decks);
app.use("/cards", cards);
app.use("/abilities", abilities);
app.use("/characters", characters);
app.use("/enemies", enemies);
app.use("/500", () => {
	// using in tests to make sure 500 errors are being handled
	throw new Error("BROKEN");
});

// error logging
app.use((err, req, res, next) => {
	const debug = createDebugMessages("backend:error");
	debug(err.stack);
	next(err);
});

app.use((err, req, res, next) => {
	res.formatter.serverError({ message: err.message, success: false });
});

// 404
app.use((req, res, next) => {
	res.formatter.notFound({ message: "Not found", success: false });
});

export { app };

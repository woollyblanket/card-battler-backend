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

import { setCards } from "./components/cards/model.js";
import { setCharacters } from "./components/characters/model.js";

import games from "./components/games/routes.js";
import players from "./components/players/routes.js";
import decks from "./components/decks/routes.js";

import { dbConnect } from "./helpers/db.js";

var app = express();

main().catch((err) => console.log(err));
async function main() {
	if (process.env.NODE_ENV !== "test") {
		await dbConnect();
		await setCards();
		await setCharacters();
	}
}

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
// error logging
app.use((err, req, res, next) => {
	const debug = createDebugMessages("backend:error");
	debug(err.stack);
	next(err);
});

app.use((err, req, res, next) => {
	res.formatter.serverError({ message: err, success: false });
});

// 404
app.use((req, res, next) => {
	res.formatter.notFound({ message: "Not found", success: false });
});

export { app };

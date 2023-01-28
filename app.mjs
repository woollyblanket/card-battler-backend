import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import favicon from "serve-favicon";
import logger from "morgan";
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import cors from "cors";
import { responseEnhancer } from "express-response-formatter";

import { setCards } from "./components/cards/model.js";
import { setCharacters } from "./components/characters/model.js";

import games from "./components/games/routes.js";
import players from "./components/players/routes.js";

import routes from "./routes/index.js";
import users from "./routes/users.js";

import { test } from "./test.js";
import { log } from "./components/games/routes.js";

var app = express();

log();

test();

mongoose.set("strictQuery", false);
const mongoDB = `mongodb://127.0.0.1:${process.env.DB_PORT}/card-battler`;

main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(mongoDB);
	await setCards();
	await setCharacters();
}

// view engine setup
app.set(
	"views",
	path.join(path.dirname(fileURLToPath(import.meta.url)), "views")
);
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
//app.use(favicon(path.dirname(fileURLToPath(import.meta.url)) + '/public/favicon.ico'));

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

app.use("/", routes);
app.use("/games", games);
app.use("/players", players);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: err,
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render("error", {
		message: err.message,
		error: {},
	});
});

export { app };

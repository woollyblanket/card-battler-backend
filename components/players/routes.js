import express from "express";
import {
	createPlayer,
	getAllPlayers,
	getPlayer,
	getPlayerByUsername,
	getAllGamesForPlayer,
	createNewGameForPlayer,
	getGameForPlayer,
} from "./model.js";
import { execute } from "../../helpers/routes.js";

import {
	evaluateRules,
	existsAndIsString,
	existsAndIsMongoID,
} from "../../helpers/validation.js";
import { check } from "express-validator";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:players:routes");

const router = express.Router();

// [post] /players - create new player
router.post(
	"/",
	existsAndIsString("username"),
	evaluateRules,
	async (req, res, next) => {
		execute(createPlayer, req, res, next);
	}
);

// [get] /players - get all players (restricted to admin users)
router.get("/", async (req, res, next) => {
	execute(getAllPlayers, req, res, next);
});

// [get] /players/:playerID - get player of id (not username)
router.get(
	"/:playerID",
	existsAndIsMongoID("playerID"),
	evaluateRules,
	async (req, res, next) => {
		execute(getPlayer, req, res, next);
	}
);

// [get] /players/username/:username - get player of username
router.get(
	"/username/:username",
	existsAndIsString("username"),
	evaluateRules,
	async (req, res, next) => {
		execute(getPlayerByUsername, req, res, next);
	}
);

// [get] /players/:playerID/games - get all games for that player
router.get(
	"/:playerID/games",
	existsAndIsMongoID("playerID"),
	evaluateRules,
	async (req, res, next) => {
		execute(getAllGamesForPlayer, req, res, next);
	}
);

// [post] /players/:playerID/games - create new game
router.post(
	"/:playerID/games",
	existsAndIsMongoID("playerID"),
	evaluateRules,
	async (req, res, next) => {
		execute(createNewGameForPlayer, req, res, next);
	}
);

// [get] /players/:playerID/games/:gameID - get specific game belonging to that player
router.get(
	"/:playerID/games/:gameID",
	existsAndIsMongoID("playerID"),
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		execute(getGameForPlayer, req, res, next);
	}
);

export default router;

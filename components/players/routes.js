import express from "express";
import { execute } from "../../helpers/routes.js";
import {
	evaluateRules,
	existsAndIsMongoID,
	existsAndIsString,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";
import {
	createForID,
	getAllEntitiesForID,
	getByField,
	getEntityForID,
} from "../../helpers/model.js";
import { Game } from "../games/model.js";
import { Player } from "./model.js";

const debug = createDebugMessages("battler:backend:players:routes");

const router = express.Router();

// [get] /players/username/:username - get player of username
router.get(
	"/username/:username",
	existsAndIsString("username"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			getByField,
			[Player, "username", req.params.username],
			req,
			res,
			next
		);
	}
);

// [get] /players/:playerID/games - get all games for that player
router.get(
	"/:playerID/games",
	existsAndIsMongoID("playerID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			getAllEntitiesForID,
			[Player, req.params.playerID, Game, "player"],
			req,
			res,
			next
		);
	}
);

// [post] /players/:playerID/games - create new game
router.post(
	"/:playerID/games",
	existsAndIsMongoID("playerID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			createForID,
			[Player, req.params.playerID, Game, "player"],
			req,
			res,
			next
		);
	}
);

// [get] /players/:playerID/games/:gameID - get specific game belonging to that player
router.get(
	"/:playerID/games/:gameID",
	existsAndIsMongoID("playerID"),
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			getEntityForID,
			[Player, req.params.playerID, Game, req.params.gameID, "player"],
			req,
			res,
			next
		);
	}
);

export default router;

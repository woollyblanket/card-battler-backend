import express from "express";
import mongoose from "mongoose";
import { execute } from "../../helpers/routes.js";
import {
	evaluateRules,
	existsAndIsMongoID,
	existsAndIsString,
	isUniqueByField,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";
import { playerSchema } from "./schema.js";
import {
	createByField,
	createForID,
	getAll,
	getAllEntitiesForID,
	getByField,
	getByID,
	getEntityForID,
} from "../../helpers/model.js";
import { Game } from "../games/model.js";

const debug = createDebugMessages("backend:players:routes");
const Player = mongoose.model("Player", playerSchema);

const router = express.Router();

// [post] /players - create new player
router.post(
	"/",
	existsAndIsString("username"),
	isUniqueByField("username", Player),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			createByField,
			[Player, "username", req.body.username],
			req,
			res,
			next
		);
	}
);

// [get] /players - get all players (restricted to admin users)
router.get("/", async (req, res, next) => {
	await execute(getAll, [Player], req, res, next);
});

// [get] /players/:playerID - get player of id (not username)
router.get(
	"/:playerID",
	existsAndIsMongoID("playerID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getByID, [Player, req.params.playerID], req, res, next);
	}
);

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

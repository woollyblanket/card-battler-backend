import { playerSchema } from "./schema.js";
import { gameSchema } from "../games/schema.js";
import mongoose from "mongoose";
import {
	getByID,
	createByField,
	getAll,
	getByField,
	getAllEntitiesForID,
	createForID,
	getEntityForID,
} from "../../helpers/model.js";
import createDebugMessages from "debug";
import { getModelDataTypes } from "../../helpers/model.js";

const debug = createDebugMessages("backend:players:model");

const Player = mongoose.model("Player", playerSchema);
const Game = mongoose.model("Game", gameSchema);

export const validAttributes = Object.getOwnPropertyNames(Player.schema.obj);
export const validDataTypes = getModelDataTypes(Player.schema.obj);

export const createPlayer = async (body, params) => {
	return createByField(Player, "username", body.username);
};

export const getAllPlayers = async (body, params) => {
	return getAll(Player);
};

export const getPlayer = async (body, params) => {
	return getByID(Player, params.playerID);
};

export const getPlayerByUsername = async (body, params) => {
	return getByField(Player, "username", params.username);
};

export const getAllGamesForPlayer = async (body, params) => {
	return getAllEntitiesForID(Player, params.playerID, Game, "player");
};

export const createNewGameForPlayer = async (body, params) => {
	return createForID(Player, params.playerID, Game, "player");
};

export const getGameForPlayer = async (body, params) => {
	return getEntityForID(
		Player,
		params.playerID,
		Game,
		params.gameID,
		"player"
	);
};

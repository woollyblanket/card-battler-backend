import { playerSchema } from "./schema.js";
import { gameSchema } from "../games/schema.js";
import mongoose from "mongoose";
import {
	createByField,
	createForID,
	getAll,
	getAllEntitiesForID,
	getByField,
	getByID,
	getEntityForID,
} from "../../helpers/model.js";
import createDebugMessages from "debug";
import { getModelDataTypes } from "../../helpers/model.js";

const debug = createDebugMessages("backend:players:model");

const Player = mongoose.model("Player", playerSchema);
const Game = mongoose.model("Game", gameSchema);

export const validAttributes = Object.getOwnPropertyNames(Player.schema.obj);
export const validDataTypes = getModelDataTypes(Player.schema.obj);

export const createPlayer = async (body) => {
	return await createByField(Player, "username", body.username);
};

export const getAllPlayers = async () => {
	return await getAll(Player);
};

export const getPlayer = async (body, params) => {
	return await getByID(Player, params.playerID);
};

export const getPlayerByUsername = async (body, params) => {
	return await getByField(Player, "username", params.username);
};

export const getAllGamesForPlayer = async (body, params) => {
	return await getAllEntitiesForID(Player, params.playerID, Game, "player");
};

export const createNewGameForPlayer = async (body, params) => {
	return await createForID(Player, params.playerID, Game, "player");
};

export const getGameForPlayer = async (body, params) => {
	return await getEntityForID(
		Player,
		params.playerID,
		Game,
		params.gameID,
		"player"
	);
};

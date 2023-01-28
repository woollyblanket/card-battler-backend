import { gameSchema } from "./schema.js";
import mongoose from "mongoose";
import { getByID, getByIDAndUpdate, deleteByID } from "../../helpers/model.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:games:model");

const Game = mongoose.model("Game", gameSchema);
export const validAttributes = Object.getOwnPropertyNames(Game.schema.obj);
const startingDeck = [];

export const getGame = async (body, params) => {
	return getByID(Game, params.gameID);
};

export const updateStatus = async (body, params) => {
	return getByIDAndUpdate(
		Game,
		params.gameID,
		"status",
		params.status,
		"assign"
	);
};

export const deleteGame = async (body, params) => {
	return deleteByID(Game, params.gameID);
};

export const updateGameAttribute = async (body, params) => {
	return getByIDAndUpdate(
		Game,
		params.gameID,
		params.attribute,
		params.amount,
		params.operation
	);
};

export const addCard = async (body, params) => {
	return getByIDAndUpdate(
		Game,
		params.gameID,
		"deck",
		params.cardID,
		"arrayAdd"
	);
};

export const removeCard = async (body, params) => {
	return getByIDAndUpdate(
		Game,
		params.gameID,
		"deck",
		params.cardID,
		"arrayRemove"
	);
};

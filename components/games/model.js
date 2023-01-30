import { gameSchema } from "./schema.js";
import mongoose from "mongoose";
import {
	getByID,
	getByIDAndUpdate,
	deleteByID,
	getModelDataTypes,
} from "../../helpers/model.js";
import createDebugMessages from "debug";
import _ from "underscore";

const debug = createDebugMessages("backend:games:model");

const Game = mongoose.model("Game", gameSchema);
export const validAttributes = Object.getOwnPropertyNames(Game.schema.obj);
export const validDataTypes = getModelDataTypes(Game.schema.obj);

const startingDeck = [];

export const getGame = async (body, params) => {
	return getByID(Game, params.gameID);
};

export const deleteGame = async (body, params) => {
	return deleteByID(Game, params.gameID);
};

export const updateGameAttribute = async (body, params) => {
	return getByIDAndUpdate(
		Game,
		params.gameID,
		params.attribute,
		params.value,
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

import { deckSchema } from "./schema.js";

import mongoose from "mongoose";
import {
	getByID,
	createByField,
	create,
	getAll,
	getByField,
	getAllEntitiesForID,
	createForID,
	getEntityForID,
	deleteByID,
	createWithData,
	getModelDataTypes,
	getByIDAndUpdate,
} from "../../helpers/model.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:decks:model");

const Deck = mongoose.model("Deck", deckSchema);

export const validAttributes = Object.getOwnPropertyNames(Deck.schema.obj);
export const validDataTypes = getModelDataTypes(Deck.schema.obj);

export const createDeck = async (body, params) => {
	return createWithData(Deck, body);
};

export const getDeck = async (body, params) => {
	return getByID(Deck, params.deckID);
};

export const updateDeckAttribute = async (body, params) => {
	return getByIDAndUpdate(
		Deck,
		params.deckID,
		params.attribute,
		params.value,
		params.operation
	);
};

export const deleteDeck = async (body, params) => {
	return deleteByID(Deck, params.deckID);
};

import { deckSchema } from "./schema.js";
import { cardSchema } from "../cards/schema.js";
import mongoose from "mongoose";
import {
	getByID,
	createByField,
	getAll,
	getByField,
	getAllEntitiesForID,
	createForID,
	getEntityForID,
	deleteByID,
	createWithData,
	resolveIDsToEntities,
	getModelDataTypes,
	getByIDAndUpdate,
} from "../../helpers/model.js";
import createDebugMessages from "debug";
import { body } from "express-validator";

const debug = createDebugMessages("backend:decks:model");

const Deck = mongoose.model("Deck", deckSchema);
const Card = mongoose.model("Card", cardSchema);

export const validAttributes = Object.getOwnPropertyNames(Deck.schema.obj);
export const validDataTypes = getModelDataTypes(Deck.schema.obj);

export const createDeck = async (body, params) => {
	return await createWithData(Deck, body);
};

export const getDeck = async (body, params) => {
	return await getByID(Deck, params.deckID);
};

export const updateDeckAttribute = async (body, params) => {
	return await getByIDAndUpdate(
		Deck,
		params.deckID,
		params.attribute,
		params.value,
		params.operation
	);
};

export const deleteDeck = async (body, params) => {
	return await deleteByID(Deck, params.deckID);
};

export const getCardsInDeck = async (body, params) => {
	return await resolveIDsToEntities(Deck, params.deckID, "cards", Card);
};

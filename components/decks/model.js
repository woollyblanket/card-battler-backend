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
} from "../../helpers/model.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:decks:model");

const Deck = mongoose.model("Deck", deckSchema);

export const createDeck = async (body, params) => {
	return create(Deck);
};

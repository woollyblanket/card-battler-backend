import { deckSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

export const Deck = mongoose.model("Deck", deckSchema);
export const deckDataTypes = getModelDataTypes(Deck.schema.obj);

import mongoose from "mongoose";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:decks:schema");
const { Schema } = mongoose;

export const deckSchema = new Schema({
	game: { type: "ObjectId", ref: "Game" },
	character: { type: "ObjectId", ref: "Character" },
	cards: [{ type: "ObjectId", ref: "Card" }],
	starter: { type: Boolean, default: false },
});

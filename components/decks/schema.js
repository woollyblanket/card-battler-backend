import mongoose from "mongoose";
const { Schema } = mongoose;

export const deckSchema = new Schema({
	game: { type: "ObjectId", ref: "Game" },
	character: { type: "ObjectId", ref: "Character" },
	cards: [{ type: "ObjectId", ref: "Card" }],
	starter: { type: Boolean, default: false },
});

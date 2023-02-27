// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";

// INTERNAL IMPORTS		///////////////////////////////////////////
const { Schema } = mongoose;

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
export const deckSchema = new Schema({
	game: { type: "ObjectId", ref: "Game" },
	character: { type: "ObjectId", ref: "Character" },
	cards: [{ type: "ObjectId", ref: "Card" }],
	starter: { type: Boolean, default: false },
});

export const joi = Joi.object({
	game: Joi.string().hex().length(24),
	character: Joi.string().hex().length(24),
	cards: Joi.array().items(Joi.string().hex().length(24)),
	starter: Joi.boolean(),
});

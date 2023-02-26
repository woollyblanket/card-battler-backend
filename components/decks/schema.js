// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";
import objectId from "joi-objectid";

Joi.objectId = objectId(Joi);

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
	game: Joi.objectId(),
	character: Joi.objectId(),
	cards: Joi.array().items(Joi.objectId()),
	starter: Joi.boolean(),
});

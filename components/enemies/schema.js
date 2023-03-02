// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	DESCRIPTION_REGEX,
	RARITIES,
	SPECIES,
} from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const enemySchema = new Schema({
	name: { type: String, required: true },
	species: { type: String, required: true, enum: SPECIES },
	description: { type: String, required: true },
	health: { type: Number },
	energy: { type: Number },
	rarity: { type: String, required: true, enum: RARITIES },
	abilities: [{ type: "ObjectId", ref: "Ability" }],
});

// ignore unused exports joi
export const joi = Joi.object({
	name: Joi.string().alphanum().trim().required(),
	species: Joi.string()
		.allow(...SPECIES)
		.required(),
	description: Joi.string().pattern(DESCRIPTION_REGEX).trim().required(),
	health: Joi.number().integer().sign("positive").max(10),
	energy: Joi.number().integer().sign("positive").max(10),
	rarity: Joi.string()
		.allow(...RARITIES)
		.required(),
	abilities: Joi.array().items(Joi.string().hex().length(24)),
});

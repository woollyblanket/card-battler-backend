// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { ARCHETYPES } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const characterSchema = new Schema({
	name: { type: String, required: true },
	archetype: { type: String, required: true, enum: ARCHETYPES },
	description: { type: String, required: true },
	health: { type: Number },
	energy: { type: Number },
	abilities: [{ type: "ObjectId", ref: "Ability" }],
});

export const joi = Joi.object({
	name: Joi.string().alphanum().trim().required(),
	archetype: Joi.string()
		.allow(...ARCHETYPES)
		.required(),
	description: Joi.string().alphanum().trim().required(),
	health: Joi.number().integer().sign("positive").max(10),
	energy: Joi.number().integer().sign("positive").max(10),
	abilities: Joi.array().items(Joi.string().hex().length(24)),
});

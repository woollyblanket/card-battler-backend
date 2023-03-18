// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { ABILITY_TYPES, DESCRIPTION_REGEX } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const abilitySchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true, enum: ABILITY_TYPES },
	description: { type: String, required: true },
	duration: { type: Number },
	damage: { type: Number },
	health: { type: Number },
	energy: { type: Number },
	shield: { type: Number },
});

// ignore unused exports joi
export const joi = Joi.object({
	name: Joi.string().alphanum().trim().required(),
	type: Joi.string()
		.allow(...ABILITY_TYPES)
		.required(),
	description: Joi.string().pattern(DESCRIPTION_REGEX).trim().required(),
	duration: Joi.number().integer().sign("positive").max(10),
	damage: Joi.number().integer().sign("positive").max(10),
	health: Joi.number().integer().sign("positive").max(10),
	energy: Joi.number().integer().sign("positive").max(10),
	shield: Joi.number().integer().sign("positive").max(10),
});

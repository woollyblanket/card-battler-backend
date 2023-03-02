// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	CARD_TYPES,
	DESCRIPTION_REGEX,
	RARITIES,
} from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;
const doneActions = ["discard", "burn"];

// PUBLIC 				///////////////////////////////////////////
export const cardSchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true, enum: CARD_TYPES },
	description: { type: String, required: true },
	duration: { type: Number },
	damage: { type: Number },
	health: { type: Number },
	shield: { type: Number },
	energy: { type: Number },
	aoe: { type: Boolean, default: false }, // area of effect, hits all enemies
	rarity: { type: String, default: "common", enum: RARITIES },
	done: { type: String, default: "discard", enum: doneActions },
	cost: { type: Number }, // how much energy does it cost to play this card
});

// ignore unused exports joi
export const joi = Joi.object({
	name: Joi.string().alphanum().trim().required(),
	type: Joi.string()
		.allow(...CARD_TYPES)
		.required(),
	description: Joi.string().pattern(DESCRIPTION_REGEX).trim().required(),
	duration: Joi.number().integer().sign("positive").max(10),
	damage: Joi.number().integer().sign("positive").max(10),
	health: Joi.number().integer().sign("positive").max(10),
	energy: Joi.number().integer().sign("positive").max(10),
	shield: Joi.number().integer().sign("positive").max(10),
	aoe: Joi.boolean(),
	rarity: Joi.string().allow(...RARITIES),
	done: Joi.string().allow(...doneActions),
	cost: Joi.number().positive().max(10),
});

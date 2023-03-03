// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";
import { joi as enemyJoi } from "../enemies/schema.js";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { STATUSES } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const gameSchema = new Schema({
	player: { type: "ObjectId", ref: "Player", required: true },
	character: { type: "ObjectId", ref: "Character", required: true },
	round: { type: Number, default: 1 },
	level: { type: Number, default: 1 },
	score: { type: Number, default: 0 },
	deck: { type: "ObjectId", ref: "Deck" },
	status: { type: String, default: "new", enum: STATUSES },
	goal: { type: Number, default: 30 },
	enemies: [{ type: Object }],
	hand: { type: [{ type: "ObjectId", ref: "Card" }], default: [] },
	drawPile: { type: [{ type: "ObjectId", ref: "Card" }], default: [] },
	burnPile: { type: [{ type: "ObjectId", ref: "Card" }], default: [] },
	created: { type: Date, default: Date.now },
	ended: { type: Date },
});

// ignore unused exports joi
export const joi = Joi.object({
	player: Joi.string().hex().length(24).required(),
	character: Joi.string().hex().length(24).required(),
	round: Joi.number().positive().integer(),
	level: Joi.number().positive().integer(),
	score: Joi.number().positive().integer(),
	deck: Joi.string().hex().length(24).required(),
	status: Joi.string()
		.allow(...STATUSES)
		.required(),
	goal: Joi.number().positive().integer(),
	enemies: Joi.array().items(Joi.object({ enemyJoi })),
	hand: Joi.array().items(Joi.string().hex().length(24)),
	drawPile: Joi.array().items(Joi.string().hex().length(24)),
	burnPile: Joi.array().items(Joi.string().hex().length(24)),
	created: Joi.date(),
	ended: Joi.date(),
});

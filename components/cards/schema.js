// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { CARD_TYPES, RARITIES } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

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
	cost: { type: Number }, // how much energy does it cost to play this card
});

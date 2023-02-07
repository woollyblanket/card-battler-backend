import mongoose from "mongoose";
import { ABILITY_TYPES } from "../../helpers/constants.js";
const { Schema } = mongoose;

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

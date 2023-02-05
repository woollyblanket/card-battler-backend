import mongoose from "mongoose";
const { Schema } = mongoose;

export const allowedTypes = ["buff", "debuff", "buff-debuff"];

export const abilitySchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true, enum: allowedTypes },
	description: { type: String, required: true },
	duration: { type: Number },
	strength: { type: String },
	health: { type: String },
	energy: { type: String },
	shield: { type: String },
});

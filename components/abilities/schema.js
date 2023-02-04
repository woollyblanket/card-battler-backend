import mongoose from "mongoose";
const { Schema } = mongoose;

export const abilitySchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true }, // buff, debuff, or buff/debuff
	description: { type: String, required: true },
	duration: { type: Number },
	strength: { type: String },
	health: { type: String },
	energy: { type: String },
	shield: { type: String },
});

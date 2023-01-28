import mongoose from "mongoose";
const { Schema } = mongoose;

export const characterSchema = new Schema({
	name: { type: String, required: true },
	architype: { type: String, required: true },
	description: { type: String, required: true },
	hp: { type: Number },
	ap: { type: Number },
	abilities: {
		damage: { type: Number },
		heal: { type: Number },
		sheild: { type: Number },
	},
});

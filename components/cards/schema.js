import mongoose from "mongoose";
const { Schema } = mongoose;

export const cardSchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	description: { type: String, required: true },
	duration: { type: Number },
	actions: {
		damage: { type: Number },
		heal: { type: Number },
		sheild: { type: Number },
	},
});

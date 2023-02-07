import mongoose from "mongoose";
import { SPECIES } from "../../helpers/constants.js";
const { Schema } = mongoose;

export const enemySchema = new Schema({
	name: { type: String, required: true },
	species: { type: String, required: true, enum: SPECIES },
	description: { type: String, required: true },
	health: { type: Number },
	energy: { type: Number },
	abilities: [{ type: "ObjectId", ref: "Ability" }],
});

import mongoose from "mongoose";
import { ARCHETYPES } from "../../helpers/constants.js";
const { Schema } = mongoose;

export const characterSchema = new Schema({
	name: { type: String, required: true },
	archetype: { type: String, required: true, enum: ARCHETYPES },
	description: { type: String, required: true },
	health: { type: Number },
	energy: { type: Number },
	abilities: [{ type: "ObjectId", ref: "Ability" }],
});

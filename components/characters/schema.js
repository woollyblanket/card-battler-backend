// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { ARCHETYPES } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const characterSchema = new Schema({
	name: { type: String, required: true },
	archetype: { type: String, required: true, enum: ARCHETYPES },
	description: { type: String, required: true },
	health: { type: Number },
	energy: { type: Number },
	abilities: [{ type: "ObjectId", ref: "Ability" }],
});

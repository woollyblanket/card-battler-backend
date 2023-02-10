// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { SPECIES } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const enemySchema = new Schema({
	name: { type: String, required: true },
	species: { type: String, required: true, enum: SPECIES },
	description: { type: String, required: true },
	health: { type: Number },
	energy: { type: Number },
	abilities: [{ type: "ObjectId", ref: "Ability" }],
});

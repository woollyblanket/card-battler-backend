// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { RARITIES, SPECIES } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const enemySchema = new Schema({
	name: { type: String, required: true },
	species: { type: String, required: true, enum: SPECIES },
	description: { type: String, required: true },
	health: { type: Number },
	energy: { type: Number },
	rarity: { type: String, required: true, enum: RARITIES },
	abilities: [{ type: "ObjectId", ref: "Ability" }],
});

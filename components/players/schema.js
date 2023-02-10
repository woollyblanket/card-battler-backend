// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const playerSchema = new Schema({
	joined: { type: Date, default: Date.now },
	username: { type: String, required: true, unique: true },
});

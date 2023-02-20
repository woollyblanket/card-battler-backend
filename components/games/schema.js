// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { STATUSES } from "../../helpers/constants.js";

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const gameSchema = new Schema({
	player: { type: "ObjectId", ref: "Player", required: true },
	character: { type: "ObjectId", ref: "Character", required: true },
	round: { type: Number, default: 1 },
	level: { type: Number, default: 1 },
	score: { type: Number, default: 0 },
	deck: { type: "ObjectId", ref: "Deck" },
	status: { type: String, default: "new", enum: STATUSES },
	goal: { type: Number, default: 30 },
	enemies: [{ type: Object }],
	hand: { type: [{ type: "ObjectId", ref: "Card" }], default: [] },
	drawPile: { type: [{ type: "ObjectId", ref: "Card" }], default: [] },
	burnPile: { type: [{ type: "ObjectId", ref: "Card" }], default: [] },
	created: { type: Date, default: Date.now },
	ended: { type: Date },
});

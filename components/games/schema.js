import mongoose from "mongoose";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:games:schema");
const { Schema } = mongoose;

export const gameSchema = new Schema({
	player: { type: "ObjectId", ref: "Player", required: true },
	round: { type: Number, default: 1 },
	level: { type: Number, default: 1 },
	score: { type: Number, default: 0 },
	deck: { type: "ObjectId", ref: "Deck" },
	status: { type: String, default: "new" },
	goal: { type: Number, default: 30 },
	created: { type: Date, default: Date.now },
	ended: { type: Date },
});

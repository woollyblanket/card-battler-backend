import mongoose from "mongoose";
import { STATUSES } from "../../helpers/constants.js";
const { Schema } = mongoose;

export const gameSchema = new Schema({
	player: { type: "ObjectId", ref: "Player", required: true },
	round: { type: Number, default: 1 },
	level: { type: Number, default: 1 },
	score: { type: Number, default: 0 },
	deck: { type: "ObjectId", ref: "Deck" },
	status: { type: String, default: "new", enum: STATUSES },
	goal: { type: Number, default: 30 },
	created: { type: Date, default: Date.now },
	ended: { type: Date },
});

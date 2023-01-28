import mongoose from "mongoose";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:players:schema");
const { Schema } = mongoose;

export const playerSchema = new Schema({
	joined: { type: Date, default: Date.now },
	username: { type: String, required: true },
});

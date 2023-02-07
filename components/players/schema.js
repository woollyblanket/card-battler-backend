import mongoose from "mongoose";
const { Schema } = mongoose;

export const playerSchema = new Schema({
	joined: { type: Date, default: Date.now },
	username: { type: String, required: true, unique: true },
});

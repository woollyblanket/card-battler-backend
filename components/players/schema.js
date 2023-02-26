// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const playerSchema = new Schema({
	joined: { type: Date, default: Date.now },
	username: { type: String, required: true, unique: true },
});

export const joi = Joi.object({
	joined: Joi.date(),
	username: Joi.string().alphanum().trim().required(),
});

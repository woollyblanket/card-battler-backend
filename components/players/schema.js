// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";
import { isUnique } from "../../helpers/joi.custom.js";
import { Player } from "./model.js";

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
	username: Joi.string()
		.alphanum()
		.trim()
		.required()
		.external(async (value) => {
			const unique = await isUnique(Player, { username: value });
			if (!unique) {
				const error = new Error(`${value} must be unique`);
				error.name = "DuplicateError";
				throw error;
			}
		}),
});

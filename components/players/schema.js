// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcrypt";
import { isUnique } from "../../helpers/joi.custom.js";
import { Player } from "./model.js";
import { SALT_WORK_FACTOR } from "../../helpers/constants.js";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const { Schema } = mongoose;

// PUBLIC 				///////////////////////////////////////////
export const playerSchema = new Schema({
	joined: { type: Date, default: Date.now },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false },
});

// ignore unused exports joi
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
	password: Joi.string().min(10).required(),
});

// can't use arrow functions, because I need access to this
playerSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (error) {
		return next(error);
	}
});

playerSchema.methods.validatePassword = async (data) => {
	return bcrypt.compare(data, this.password);
};

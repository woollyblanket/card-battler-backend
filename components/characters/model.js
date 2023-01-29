import { characterSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

const Character = mongoose.model("Character", characterSchema);
export const validAttributes = Object.getOwnPropertyNames(Character.schema.obj);
export const validDataTypes = getModelDataTypes(Character.schema.obj);

export const setCharacters = async () => {
	await new Character({
		name: "The Hero",
		architype: "hero",
		description: "The Hero is strong",
		hp: 70,
		ap: 3,
		abilities: {
			damage: 2,
		},
	}).save();
	await new Character({
		name: "The Protector",
		architype: "tank",
		description: "The Protector is durable",
		hp: 100,
		ap: 3,
		abilities: {
			sheild: 2,
		},
	}).save();
	await new Character({
		name: "The Survivor",
		architype: "nimble",
		description: "The Survivor is digs deep",
		hp: 70,
		ap: 5,
	}).save();
};

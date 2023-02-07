import { characterSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";
import {
	createWithData,
	deleteByID,
	getByID,
	getByIDAndUpdate,
} from "../../helpers/model.js";

const Character = mongoose.model("Character", characterSchema);
export const characterDataTypes = getModelDataTypes(Character.schema.obj);

export const createCharacter = async (body) => {
	return await createWithData(Character, body);
};

export const getCharacter = async (body, params) => {
	return await getByID(Character, params.characterID);
};

export const updateCharacterAttribute = async (body, params) => {
	return await getByIDAndUpdate(
		Character,
		params.characterID,
		params.attribute,
		params.value,
		params.operation
	);
};

export const deleteCharacter = async (body, params) => {
	return await deleteByID(Character, params.characterID);
};

import { abilitySchema } from "./schema.js";
import mongoose from "mongoose";
import {
	getModelDataTypes,
	createWithData,
	getByID,
	getByIDAndUpdate,
	deleteByID,
} from "../../helpers/model.js";

const Ability = mongoose.model("Ability", abilitySchema);
export const validAttributes = Object.getOwnPropertyNames(Ability.schema.obj);
export const validDataTypes = getModelDataTypes(Ability.schema.obj);
export const validAbilityTypes = ["buff", "debuff", "buff-debuff"];

export const createAbility = async (body, params) => {
	return await createWithData(Ability, body);
};

export const getAbility = async (body, params) => {
	return await getByID(Ability, params.abilityID);
};

export const updateAbilityAttribute = async (body, params) => {
	return await getByIDAndUpdate(
		Ability,
		params.abilityID,
		params.attribute,
		params.value,
		params.operation
	);
};

export const deleteAbility = async (body, params) => {
	return await deleteByID(Ability, params.abilityID);
};

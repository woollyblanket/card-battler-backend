import { abilitySchema } from "./schema.js";
import mongoose from "mongoose";
import {
	createWithData,
	deleteByID,
	getByID,
	getByIDAndUpdate,
	getModelDataTypes,
} from "../../helpers/model.js";

const Ability = mongoose.model("Ability", abilitySchema);
export const abilityDataTypes = getModelDataTypes(Ability.schema.obj);

export const createAbility = async (body) => {
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

import { enemySchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";
import {
	createWithData,
	deleteByID,
	getByID,
	getByIDAndUpdate,
} from "../../helpers/model.js";

const Enemy = mongoose.model("Enemy", enemySchema);
export const enemyDataTypes = getModelDataTypes(Enemy.schema.obj);

export const createEnemy = async (body) => {
	return await createWithData(Enemy, body);
};

export const getEnemy = async (body, params) => {
	return await getByID(Enemy, params.enemyID);
};

export const updateEnemyAttribute = async (body, params) => {
	return await getByIDAndUpdate(
		Enemy,
		params.enemyID,
		params.attribute,
		params.value,
		params.operation
	);
};

export const deleteEnemy = async (body, params) => {
	return await deleteByID(Enemy, params.enemyID);
};

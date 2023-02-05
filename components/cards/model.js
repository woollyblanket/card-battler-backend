import { allowedRarities, allowedTypes, cardSchema } from "./schema.js";
import mongoose from "mongoose";
import {
	createWithData,
	deleteByID,
	getByID,
	getByIDAndUpdate,
	getModelDataTypes,
} from "../../helpers/model.js";

export const Card = mongoose.model("Card", cardSchema);
export const validAttributes = Object.getOwnPropertyNames(Card.schema.obj);
export const validDataTypes = getModelDataTypes(Card.schema.obj);
export const validCardTypes = allowedTypes;
export const validRarities = allowedRarities;

export const createCard = async (body) => {
	return await createWithData(Card, body);
};

export const getCard = async (body, params) => {
	return await getByID(Card, params.cardID);
};

export const updateCardAttribute = async (body, params) => {
	return await getByIDAndUpdate(
		Card,
		params.cardID,
		params.attribute,
		params.value,
		params.operation
	);
};

export const deleteCard = async (body, params) => {
	return await deleteByID(Card, params.cardID);
};

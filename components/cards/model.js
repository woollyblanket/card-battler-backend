import { cardSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

const Card = mongoose.model("Card", cardSchema);
export const validAttributes = Object.getOwnPropertyNames(Card.schema.obj);
export const validDataTypes = getModelDataTypes(Card.schema.obj);

export const setCards = async () => {
	await new Card({
		name: "Cut",
		type: "damage-dealer",
		description: "Deals 7 damage",
		actions: { damage: 7 },
	}).save();
	await new Card({
		name: "Heal",
		type: "healer",
		description: "Heals 7 points",
		actions: { heal: 7 },
	}).save();
	await new Card({
		name: "Bleeding",
		type: "debuff",
		description: "Deals 2 damage over time",
		duration: 3,
		actions: { damage: 2 },
	}).save();
	await new Card({
		name: "Divine Blessing",
		type: "buff",
		description: "Heals 2 points over time",
		duration: 3,
		actions: { heal: 2 },
	}).save();
	await new Card({
		name: "Shield",
		type: "shield",
		description: "Shields 7 damage",
		actions: { shield: 7 },
	}).save();
};

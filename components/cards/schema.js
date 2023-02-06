import mongoose from "mongoose";
const { Schema } = mongoose;

export const allowedTypes = ["attack", "heal", "shield", "buff", "debuff"];
export const allowedRarities = [
	"mythic",
	"legendary",
	"epic",
	"rare",
	"uncommon",
	"common",
];

export const cardSchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true, enum: allowedTypes },
	description: { type: String, required: true },
	duration: { type: Number },
	damage: { type: Number },
	health: { type: Number },
	shield: { type: Number },
	energy: { type: Number },
	aoe: { type: Boolean, default: false }, // area of effect, hits all enemies
	rarity: { type: String, default: "common", enum: allowedRarities },
	cost: { type: Number }, // how much energy does it cost to play this card
});

import { CardBuilder } from "../../helpers/seeder.js";

const data = {
	name: "",
	type: "attack",
	description: "",
	actionName: "damage",
	actionValue: 0,
	duration: 0,
	cost: 0,
	aoe: false,
	rarity: "common",
	pluralSubject: "all enemies",
	singularSubject: "an enemy",
};

// ignore unused exports default
export default {
	modelName: "Card",
	data: [
		new CardBuilder({ ...data, name: "Test1", actionValue: 7, cost: 2 }),
		new CardBuilder({ ...data, name: "Test2", actionValue: 7, cost: 2 }),
	],
};

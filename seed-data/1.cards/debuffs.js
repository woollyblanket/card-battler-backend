import { CardBuilder } from "../../helpers/seeder.js";

const data = {
	name: "",
	type: "debuff",
	description: "",
	actionName: "debuff",
	actionValue: 0,
	duration: 0,
	cost: 0,
	aoe: false,
	rarity: "common",
	pluralSubject: "all enemies",
	singularSubject: "an enemy",
};

export default {
	modelName: "Card",
	data: [
		new CardBuilder({
			...data,
			name: "Energy Ooze",
			actionName: "energy",
			actionValue: 2,
			cost: 2,
			duration: 3,
		}),
		new CardBuilder({
			...data,
			name: "Damage Ooze",
			actionName: "damage",
			actionValue: 2,
			cost: 2,
			duration: 3,
		}),
		new CardBuilder({
			...data,
			name: "Health Ooze",
			actionName: "heal",
			actionValue: 2,
			cost: 2,
			duration: 3,
		}),
		new CardBuilder({
			...data,
			name: "Shield Ooze",
			actionName: "shield",
			actionValue: 2,
			cost: 2,
			duration: 3,
		}),
		new CardBuilder({
			...data,
			name: "Energy Drain",
			actionName: "energy",
			actionValue: 7,
			cost: 2,
			duration: 3,
			rarity: "uncommon",
		}),
		new CardBuilder({
			...data,
			name: "Damage Drain",
			actionName: "damage",
			actionValue: 7,
			cost: 2,
			duration: 3,
			rarity: "uncommon",
		}),
		new CardBuilder({
			...data,
			name: "Health Drain",
			actionName: "heal",
			actionValue: 7,
			cost: 2,
			duration: 3,
			rarity: "uncommon",
		}),
		new CardBuilder({
			...data,
			name: "Shield Drain",
			actionName: "shield",
			actionValue: 7,
			cost: 2,
			duration: 3,
			rarity: "uncommon",
		}),
		new CardBuilder({
			...data,
			name: "Damage Bleed",
			actionName: "damage",
			actionValue: 10,
			cost: 3,
			duration: 3,
			rarity: "rare",
		}),
		new CardBuilder({
			...data,
			name: "Shield Bleed",
			actionName: "shield",
			actionValue: 10,
			cost: 3,
			duration: 3,
			rarity: "rare",
		}),
	],
};

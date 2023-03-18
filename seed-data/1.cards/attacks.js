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
		new CardBuilder({ ...data, name: "Cut", actionValue: 7, cost: 2 }),
		new CardBuilder({ ...data, name: "Slice", actionValue: 3, cost: 1 }),
		new CardBuilder({
			...data,
			name: "Stab",
			actionValue: 10,
			cost: 2,
			rarity: "uncommon",
		}),
		new CardBuilder({
			...data,
			name: "Blast",
			actionValue: 4,
			cost: 2,
			aoe: true,
		}),
		new CardBuilder({ ...data, name: "Bludgeon", actionValue: 8, cost: 2 }),
		new CardBuilder({
			...data,
			name: "Scythe",
			actionValue: 10,
			cost: 3,
			rarity: "rare",
			aoe: true,
		}),
		new CardBuilder({
			...data,
			name: "Needle",
			actionValue: 2,
			cost: 0,
			description: "Stabs an enemy with a small needle for 2 points",
		}),
		new CardBuilder({ ...data, name: "Burn", actionValue: 5, cost: 1 }),
		new CardBuilder({
			...data,
			name: "Fireball",
			actionValue: 5,
			cost: 3,
			aoe: true,
		}),
		new CardBuilder({ ...data, name: "Punch", actionValue: 1, cost: 0 }),
	],
};

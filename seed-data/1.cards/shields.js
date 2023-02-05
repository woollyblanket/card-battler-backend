import { CardBuilder } from "../../helpers/seeder.js";

const data = {
	name: "",
	type: "shield",
	description: "",
	actionName: "shield",
	actionValue: 0,
	duration: 0,
	cost: 0,
	aoe: false,
	rarity: "common",
	pluralSubject: "",
	singularSubject: "",
};

export default {
	modelName: "Card",
	data: [
		new CardBuilder({ ...data, name: "Shield", actionValue: 7, cost: 2 }),
		new CardBuilder({ ...data, name: "Hide", actionValue: 2, cost: 1 }),
		new CardBuilder({
			...data,
			name: "Duck and Cover",
			actionValue: 10,
			cost: 2,
			rarity: "uncommon",
		}),
		new CardBuilder({
			...data,
			name: "Guard",
			actionValue: 4,
			cost: 2,
		}),
		new CardBuilder({
			...data,
			name: "Defend",
			actionValue: 8,
			cost: 2,
		}),
		new CardBuilder({
			...data,
			name: "Ward",
			actionValue: 10,
			cost: 3,
			rarity: "rare",
		}),
		new CardBuilder({
			...data,
			name: "Duck",
			actionValue: 2,
			cost: 0,
		}),
		new CardBuilder({ ...data, name: "Dodge", actionValue: 5, cost: 1 }),
		new CardBuilder({
			...data,
			name: "Camouflage",
			actionValue: 5,
			cost: 1,
		}),
		new CardBuilder({
			...data,
			name: "Absorb",
			actionValue: 1,
			cost: 0,
		}),
	],
};

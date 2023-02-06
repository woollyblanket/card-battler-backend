import { CardBuilder } from "../../helpers/seeder.js";

const data = {
	name: "",
	type: "heal",
	description: "",
	actionName: "health",
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
		new CardBuilder({ ...data, name: "Heal", actionValue: 7, cost: 2 }),
		new CardBuilder({ ...data, name: "Rest", actionValue: 2, cost: 1 }),
		new CardBuilder({
			...data,
			name: "Cure",
			actionValue: 10,
			cost: 2,
			rarity: "uncommon",
		}),
		new CardBuilder({
			...data,
			name: "Bandage",
			actionValue: 4,
			cost: 2,
		}),
		new CardBuilder({
			...data,
			name: "Recuperate",
			actionValue: 8,
			cost: 2,
		}),
		new CardBuilder({
			...data,
			name: "Medicate",
			actionValue: 10,
			cost: 3,
			rarity: "rare",
		}),
		new CardBuilder({
			...data,
			name: "Meditate",
			actionValue: 2,
			cost: 0,
		}),
		new CardBuilder({ ...data, name: "Nap", actionValue: 5, cost: 1 }),
		new CardBuilder({
			...data,
			name: "Convalesce",
			actionValue: 5,
			cost: 1,
		}),
		new CardBuilder({
			...data,
			name: "Take a Breath",
			actionValue: 1,
			cost: 0,
			description: "Breathes deep for 1 point",
		}),
	],
};

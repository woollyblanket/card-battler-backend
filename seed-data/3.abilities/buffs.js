import { AbilityBuilder } from "../../helpers/seeder.js";

const data = {
	name: "",
	type: "buff",
	description: "",
	duration: null,
	actionName: "",
	actionValue: 0,
};

export default {
	modelName: "Ability",
	data: [
		new AbilityBuilder({
			...data,
			name: "Super Strength",
			actionName: "damage",
			actionValue: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Super Health",
			actionName: "health",
			actionValue: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Super Endurance",
			actionName: "energy",
			actionValue: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Energy Burst",
			actionName: "energy",
			actionValue: 3,
			duration: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Intuition",
			actionName: "see intent",
			actionValue: true,
		}),
	],
};

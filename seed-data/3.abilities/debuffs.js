import { AbilityBuilder } from "../../helpers/seeder.js";

const data = {
	name: "",
	type: "debuff",
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
			name: "Poor Strength",
			actionName: "damage",
			actionValue: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Poor Health",
			actionName: "health",
			actionValue: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Poor Endurance",
			actionName: "energy",
			actionValue: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Energy Crash",
			actionName: "energy",
			actionValue: 3,
			duration: 3,
		}),
	],
};

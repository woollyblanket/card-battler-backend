import { AbilityBuilder } from "../../helpers/seeder.js";

const data = {
	name: "",
	type: "buff",
	description: "",
	duration: null,
	actionName: "",
	actionValue: 0,
};

// ignore unused exports default
export default {
	modelName: "Ability",
	data: [
		new AbilityBuilder({
			...data,
			name: "Test1",
			actionName: "damage",
			actionValue: 3,
		}),
		new AbilityBuilder({
			...data,
			name: "Test2",
			actionName: "health",
			actionValue: 3,
		}),
	],
};

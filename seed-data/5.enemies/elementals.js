import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "elemental",
	description: "",
	health: 100,
	energy: 3,
	abilities: [],
};

export default {
	modelName: "Enemy",
	data: [
		new EnemyBuilder({
			...data,
			name: "Fire",
		}),
		new EnemyBuilder({
			...data,
			name: "Earth",
		}),
		new EnemyBuilder({
			...data,
			name: "Air",
		}),
		new EnemyBuilder({
			...data,
			name: "Water",
		}),
		new EnemyBuilder({
			...data,
			name: "Gravity",
		}),
	],
};

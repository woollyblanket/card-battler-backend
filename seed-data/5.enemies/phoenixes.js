import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "phoenix",
	description: "",
	health: 90,
	energy: 2,
	abilities: [],
};

export default {
	modelName: "Enemy",
	data: [
		new EnemyBuilder({
			...data,
			name: "Flame",
		}),
		new EnemyBuilder({
			...data,
			name: "Soar",
		}),
		new EnemyBuilder({
			...data,
			name: "Glide",
		}),
		new EnemyBuilder({
			...data,
			name: "Ash",
		}),
		new EnemyBuilder({
			...data,
			name: "Ember",
		}),
	],
};

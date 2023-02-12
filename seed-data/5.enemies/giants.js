import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "giant",
	description: "",
	health: 120,
	energy: 1,
	abilities: [],
};

export default {
	modelName: "Enemy",
	data: [
		new EnemyBuilder({
			...data,
			name: "Fee",
		}),
		new EnemyBuilder({
			...data,
			name: "Fi",
		}),
		new EnemyBuilder({
			...data,
			name: "Fo",
		}),
		new EnemyBuilder({
			...data,
			name: "Fum",
		}),
		new EnemyBuilder({
			...data,
			name: "Jack",
		}),
	],
};

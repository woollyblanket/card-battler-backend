import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "giant",
	description: "",
	health: 120,
	energy: 1,
	rarity: "rare",
	abilities: [],
};

// ignore unused exports default
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
		new EnemyBuilder({
			...data,
			name: "Bean",
			rarity: "legendary",
		}),
	],
};

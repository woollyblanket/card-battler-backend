import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "goblin",
	description: "",
	health: 20,
	energy: 1,
	rarity: "common",
	abilities: [],
};

// ignore unused exports default
export default {
	modelName: "Enemy",
	data: [
		new EnemyBuilder({
			...data,
			name: "Chunk",
		}),
		new EnemyBuilder({
			...data,
			name: "Pin",
		}),
		new EnemyBuilder({
			...data,
			name: "Stick",
		}),
		new EnemyBuilder({
			...data,
			name: "Spike",
		}),
		new EnemyBuilder({
			...data,
			name: "Bast",
		}),
	],
};

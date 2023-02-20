import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "ghost",
	description: "",
	health: 30,
	energy: 1,
	rarity: "common",
	abilities: [],
};

export default {
	modelName: "Enemy",
	data: [
		new EnemyBuilder({
			...data,
			name: "Boo",
		}),
		new EnemyBuilder({
			...data,
			name: "Scream",
		}),
		new EnemyBuilder({
			...data,
			name: "Fling",
		}),
		new EnemyBuilder({
			...data,
			name: "Shiver",
		}),
		new EnemyBuilder({
			...data,
			name: "Shadow",
		}),
	],
};

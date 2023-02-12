import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "ooze",
	description: "",
	health: 60,
	energy: 2,
	abilities: [],
};

export default {
	modelName: "Enemy",
	data: [
		new EnemyBuilder({
			...data,
			name: "Goop",
		}),
		new EnemyBuilder({
			...data,
			name: "Blob",
		}),
		new EnemyBuilder({
			...data,
			name: "Puddle",
		}),
		new EnemyBuilder({
			...data,
			name: "Slime",
		}),
		new EnemyBuilder({
			...data,
			name: "Goo",
		}),
	],
};

import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "dragon",
	description: "",
	health: 150,
	energy: 2,
	rarity: "epic",
	abilities: [],
};

export default {
	modelName: "Enemy",
	data: [
		new EnemyBuilder({
			...data,
			name: "Blue",
		}),
		new EnemyBuilder({
			...data,
			name: "Green",
		}),
		new EnemyBuilder({
			...data,
			name: "Red",
		}),
		new EnemyBuilder({
			...data,
			name: "Gold",
		}),
		new EnemyBuilder({
			...data,
			name: "Black",
		}),
		new EnemyBuilder({
			...data,
			name: "Platinum",
			rarity: "mythic",
		}),
	],
};

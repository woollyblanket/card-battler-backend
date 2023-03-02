import { EnemyBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	species: "beast",
	description: "",
	health: 50,
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
			name: "Roar",
		}),
		new EnemyBuilder({
			...data,
			name: "Gnash",
		}),
		new EnemyBuilder({
			...data,
			name: "Chomp",
		}),
		new EnemyBuilder({
			...data,
			name: "Slink",
		}),
		new EnemyBuilder({
			...data,
			name: "Swipe",
		}),
	],
};

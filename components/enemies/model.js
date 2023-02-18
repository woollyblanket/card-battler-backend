// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import { weightedRandom } from "../../helpers/algos.js";
import { RARITY_WEIGHTS } from "../../helpers/constants.js";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { enemySchema } from "./schema.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
export const Enemy = mongoose.model("Enemy", enemySchema);

export const spawnEnemies = async (currentLevel) => {
	// rules for spawning enemies:
	// spawn between 1 and 3 enemies, with a bias towards the lower numbers
	// use the rarity to determine which enemy spawns
	// randomly choose enemies of that rarity
	// use the level to make the enemy more difficult to beat
	// each level increases the enemy's health by a certain percentage
	const enemyCount = weightedRandom([1, 2, 3], [10, 5, 1]);
	const addon = currentLevel * 0.3;

	let rarities = [];
	let weights = [];

	for (const [key, value] of Object.entries(RARITY_WEIGHTS)) {
		rarities.push(key);
		weights.push(value);
	}

	const rarity = weightedRandom(rarities, weights);

	let enemies = [];

	const allEnemiesOfRarity = await Enemy.find({ rarity: rarity.item });

	for (let i = 1; i <= enemyCount.item; i++) {
		const rand =
			Math.floor(Math.random() * allEnemiesOfRarity.length - 1) + 1;

		const enemy = allEnemiesOfRarity[rand];
		enemy.health = Math.ceil(enemy.health + addon);
		enemies.push(enemy);
	}

	return enemies;
};

const doEnemyTurn = () => {};

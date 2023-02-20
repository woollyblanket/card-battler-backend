// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import { cloneDeck, drawHand, getStarterDeck } from "../decks/model.js";
import { spawnEnemies } from "../enemies/model.js";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { gameSchema } from "./schema.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
export const Game = mongoose.model("Game", gameSchema);

export const getGame = async (id) => {
	return await Game.findOne({ _id: id }).exec();
};

export const newGame = async ([playerID, characterID]) => {
	try {
		// deck is initialised using the starting deck as a template
		const starterDeck = await getStarterDeck();
		const clonedDeck = await cloneDeck(starterDeck);

		const game = await Game.create({
			player: playerID,
			character: characterID,
			round: 1,
			level: 1,
			score: 0,
			status: "new",
			deck: clonedDeck._id,
		});

		// level 1 starts
		await startLevel(1, game);

		return {
			message: `Started a new game`,
			success: true,
			entity: game,
		};
	} catch (error) {
		return { error };
	}
};

const endGame = () => {
	// change game status
	// log score to leader board
};

const startLevel = async (level, game) => {
	// spawn enemies
	const enemies = await spawnEnemies(level);
	game.enemies = enemies;
	game.status = "active";
	game.level = level;
	await game.save();

	// round 1 starts
	await startRound(1, game);
};

const endLevel = () => {
	// win - destroy enemies, claim rewards, go to next level
	// lose - end game
};

const startRound = async (round, game) => {
	// draw hand
	const piles = await drawHand(game.deck);
	game.hand = piles.hand;
	game.drawPile = piles.drawPile;
	game.round = round;
	await game.save();

	// break here. Nothing happens until the user plays a card

	// player plays cards
	// enemies take rounds
	// check if round ends and then end round
};

const endRound = () => {
	// 3 ways that a round can end
	// enemies win - end game
	// player wins - end level
	// no one wins - new round
};

// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import { getGame } from "../games/model.js";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { cardSchema } from "./schema.js";

// PRIVATE 				///////////////////////////////////////////
const doDamage = async (card, game, target) => {
	// TODO
	// do I have a damage over time card?
	// maybe, will need to handle the case where
	// duration is set if so
	if (card.aoe) {
		// hit all enemies
		for (const enemy of game.enemies) {
			enemy.health -= card.damage;
		}
	} else {
		// hit the target enemy
		target.health -= card.damage;
	}
};

const doHealth = async (card, game) => {
	// get player
};

// PUBLIC 				///////////////////////////////////////////
export const Card = mongoose.model("Card", cardSchema);

export const playCard = async ([model, cardID, gameID, target]) => {
	try {
		// get the game from the db
		const game = await getGame(gameID);
		// get the card from the db
		const card = await model.findOne({ _id: cardID }).exec();

		// check if the card is in the hand
		if (!game.hand.includes(card._id))
			throw new Error(`Card ${card._id} isn't in the player's hand`);

		// do the things on the card
		if (card.damage) await doDamage(card, game, target);

		if (card.health) await doHealth(card, game);

		if (card.shield) await doShield(card, game);

		if (card.energy) await doEnergy(card, game);

		await doCost(card);

		// either discard the card (default), or burn it if required
		if (card.done === "discard") {
			discardCard(card);
		} else {
			burnCard(card);
		}

		await game.save();

		return {
			message: `Played a card: ${card.name}`,
			success: true,
			entity: game,
		};
	} catch (error) {
		return { error };
	}
};

const discardCard = () => {};

const burnCard = () => {};

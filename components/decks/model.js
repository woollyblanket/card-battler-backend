// EXTERNAL IMPORTS		///////////////////////////////////////////
import mongoose from "mongoose";
import _ from "lodash";
import { HAND_DEFAULTS } from "../../helpers/constants.js";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { deckSchema } from "./schema.js";

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
export const Deck = mongoose.model("Deck", deckSchema);

export const getStarterDeck = async () => {
	return await Deck.findOne({ starter: true }).exec();
};

export const cloneDeck = async (deck) => {
	const newDeck = {
		...deck.toObject(),
		_id: new mongoose.Types.ObjectId(),
		starter: false,
	};
	return await Deck.create(newDeck);
};

export const drawHand = async (deckID, drawCount = HAND_DEFAULTS.drawCount) => {
	const deck = await Deck.findOne({ _id: deckID }).exec();
	console.log("deck :>> ", deck);
	let drawn = [];
	let drawPile = _.cloneDeep(deck.cards);
	let hand = [];

	for (let i = 0; i < drawCount; i++) {
		const random = Math.floor(Math.random() * deck.cards.length);
		drawn.push(random);
		hand.push(deck.cards[random]);
		drawPile[random] = null;
	}

	// remove falsy values
	drawPile = _.compact(drawPile);

	return { hand, drawPile };
};

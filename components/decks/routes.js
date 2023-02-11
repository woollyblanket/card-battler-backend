// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Deck } from "./model.js";
import { Card } from "../cards/model.js";
import { execute } from "../../helpers/routes.js";
import { evaluateRules } from "../../helpers/validation.evaluate.js";
import { existsAndIsMongoID } from "../../helpers/validation.standard.js";
import { resolveIDsToEntities } from "../../helpers/model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:decks:routes");
const router = express.Router();

debug(Deck);

// PUBLIC 				///////////////////////////////////////////
// [get] /decks/:id/cards - get all the cards in the deck
router.get(
	"/:deckID/cards",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			resolveIDsToEntities,
			[Deck, req.params.deckID, "cards", Card],
			req,
			res,
			next
		);
	}
);

export default router;

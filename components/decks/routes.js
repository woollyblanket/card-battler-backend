import express from "express";
import { Deck } from "./model.js";
import { execute } from "../../helpers/routes.js";
import { evaluateRules, existsAndIsMongoID } from "../../helpers/validation.js";
import createDebugMessages from "debug";
import { resolveIDsToEntities } from "../../helpers/model.js";
import { Card } from "../cards/model.js";

const debug = createDebugMessages("backend:decks:routes");
const router = express.Router();

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

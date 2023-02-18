// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Card, playCard } from "./model.js";
import { existsAndIsMongoID } from "../../helpers/validation.standard.js";
import { evaluateRules } from "../../helpers/validation.evaluate.js";
import { execute } from "../../helpers/routes.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:cards:routes");
const router = express.Router();

debug(Card);

// PUBLIC 				///////////////////////////////////////////

// [post] /cards/:id/play - get all the cards in the deck
router.post(
	"/:id/play",
	existsAndIsMongoID("id"),
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			playCard,
			[Card, req.params.id, req.body.gameID],
			req,
			res,
			next
		);
	}
);

export default router;

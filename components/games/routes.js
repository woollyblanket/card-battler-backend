// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Game, newGame } from "./model.js";
import { existsAndIsMongoID } from "../../helpers/validation.standard.js";
import { evaluateRules } from "../../helpers/validation.evaluate.js";
import { execute } from "../../helpers/routes.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:games:routes");
const router = express.Router();

debug(Game);

// PUBLIC 				///////////////////////////////////////////

// [post] /games - create new game
router.post(
	"/",
	existsAndIsMongoID("playerID"),
	existsAndIsMongoID("characterID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			newGame,
			[req.body.playerID, req.body.characterID],
			req,
			res,
			next
		);
	}
);

export default router;

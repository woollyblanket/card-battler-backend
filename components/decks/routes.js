import express from "express";
import { createDeck } from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	evaluateRules,
	isMongoID,
	isArrayOfObjectIDs,
	existsAndIsString,
	existsAndIsNumber,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	validAttributes,
	validOperations,
	existsAndIsAlphanumeric,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:decks:routes");
const router = express.Router();

// [post] /decks - create a new deck
router.post(
	"/",
	isMongoID("game"),
	isMongoID("character"),
	isArrayOfObjectIDs("cards"),
	evaluateRules,
	async (req, res, next) => {
		execute(createDeck, req, res);
	}
);

// [get] /decks/:id - get deck of id
router.get(
	"/:gameID",
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		execute(getGame, req, res);
	}
);

// [get] /decks - get all decks
// [patch] /decks/:id/add/:id - add a card to a deck
// [patch] /decks/:id/remove/:id - remove a card from a deck
// [patch] /decks/:id/assign-to-player/:id - assign a deck to a player
export default router;

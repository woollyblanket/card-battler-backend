import express from "express";
import {
	createDeck,
	deleteDeck,
	getCardsInDeck,
	getDeck,
	updateDeckAttribute,
} from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	checkIfEnumerated,
	checkParamCombination,
	evaluateRules,
	existsAndIsAlphanumeric,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	isArrayOfObjectIDs,
	isMongoID,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";
import { OPERATIONS } from "../../helpers/constants.js";
import { SCHEMA_PROPERTIES } from "../../helpers/schema.js";

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
		await execute(createDeck, req, res, next);
	}
);

// [get] /decks/:id - get deck of id
router.get(
	"/:deckID",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getDeck, req, res, next);
	}
);

// [patch] /decks/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:deckID/:attribute/:operation/:value",
	existsAndIsMongoID("deckID"),
	existsAndIsOneOfList("attribute", SCHEMA_PROPERTIES.deck),
	existsAndIsOneOfList("operation", OPERATIONS),
	existsAndIsAlphanumeric("value"),
	checkParamCombination("decks"),
	checkParamCombination("decks"),
	checkIfEnumerated("attribute", "status"),
	evaluateRules,
	async (req, res, next) => {
		await execute(updateDeckAttribute, req, res, next);
	}
);

// [delete] /decks/:id - deletes the deck
router.delete(
	"/:deckID",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(deleteDeck, req, res, next);
	}
);

// [get] /decks/:id/cards - get all the cards in the deck
router.get(
	"/:deckID/cards",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getCardsInDeck, req, res, next);
	}
);

export default router;

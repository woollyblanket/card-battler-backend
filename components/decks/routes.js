import express from "express";
import {
	createDeck,
	getDeck,
	updateDeckAttribute,
	deleteDeck,
	getCardsInDeck,
} from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	evaluateRules,
	isMongoID,
	isArrayOfObjectIDs,
	existsAndIsString,
	existsAndIsNumber,
	checkIfAllowedDataTypeAndOperation,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	validAttributes,
	checkIfStatus,
	validOperations,
	validDataTypes,
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
		execute(createDeck, req, res, next);
	}
);

// [get] /decks/:id - get deck of id
router.get(
	"/:deckID",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		execute(getDeck, req, res, next);
	}
);

// [patch] /decks/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:deckID/:attribute/:operation/:value",
	existsAndIsMongoID("deckID"),
	existsAndIsOneOfList("attribute", validAttributes.deck),
	existsAndIsOneOfList("operation", validOperations),
	existsAndIsAlphanumeric("value"),
	checkIfAllowedDataTypeAndOperation("attribute", validDataTypes.deck),
	checkIfStatus("attribute"),
	evaluateRules,
	async (req, res, next) => {
		execute(updateDeckAttribute, req, res, next);
	}
);

// [delete] /decks/:id - deletes the deck
router.delete(
	"/:deckID",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		execute(deleteDeck, req, res, next);
	}
);

// [get] /decks/:id/cards - get all the cards in the deck
router.get(
	"/:deckID/cards",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		execute(getCardsInDeck, req, res, next);
	}
);

export default router;

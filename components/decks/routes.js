import express from "express";
import { createDeck, getDeck } from "./model.js";
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
import { updateDeckAttribute } from "./model.js";
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
	"/:deckID",
	existsAndIsMongoID("deckID"),
	evaluateRules,
	async (req, res, next) => {
		execute(getDeck, req, res);
	}
);

// [patch] /decks/:id/add/:id - add a card to a deck
// [patch] /decks/:id/remove/:id - remove a card from a deck
// [patch] /decks/:id/assign-to-player/:id - assign a deck to a player

// [patch] /games/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
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
		execute(updateDeckAttribute, req, res);
	}
);

export default router;

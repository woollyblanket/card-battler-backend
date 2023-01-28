import express from "express";
import {
	getGame,
	updateStatus,
	deleteGame,
	updateGameAttribute,
	addCard,
	removeCard,
} from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	evaluateRules,
	validStatuses,
	existsAndIsString,
	existsAndIsNumber,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	validAttributes,
	validOperations,
	existsAndIsAlphanumeric,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:games:routes");

const router = express.Router();

// [get] /games/:id - get game of id
router.get(
	"/:gameID",
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		console.log("process.env get :>> ", process.env.DB_PORT);
		execute(getGame, req, res);
	}
);

// [patch] /games/:id/status/:status - updates the status of the game.
router.patch(
	"/:gameID/status/:status",
	existsAndIsMongoID("gameID"),
	existsAndIsOneOfList("status", validStatuses),
	evaluateRules,
	async (req, res, next) => {
		execute(updateStatus, req, res);
	}
);

// [delete] /games/:id - deletes the game
router.delete(
	"/:gameID",
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		execute(deleteGame, req, res);
	}
);

// [patch] /games/:id/:property/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:gameID/:attribute/:operation/:amount",
	existsAndIsMongoID("gameID"),
	existsAndIsOneOfList("attribute", validAttributes.game),
	existsAndIsOneOfList("operation", validOperations),
	existsAndIsAlphanumeric("amount"),
	evaluateRules,
	async (req, res, next) => {
		execute(updateGameAttribute, req, res);
	}
);

// [patch] /games/:id/deck/add/:cardID - adds a card to the deck
router.patch(
	"/:gameID/deck/add/:cardID",
	existsAndIsMongoID("gameID"),
	existsAndIsMongoID("cardID"),
	evaluateRules,
	async (req, res, next) => {
		execute(addCard, req, res);
	}
);

// [patch] /games/:id/deck/remove/:cardID - removes a card from the deck
router.patch(
	"/:gameID/deck/remove/:cardID",
	existsAndIsMongoID("gameID"),
	existsAndIsMongoID("cardID"),
	evaluateRules,
	async (req, res, next) => {
		execute(removeCard, req, res);
	}
);

export default router;

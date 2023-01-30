import express from "express";
import {
	getGame,
	deleteGame,
	updateGameAttribute,
	addCard,
	removeCard,
} from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	evaluateRules,
	existsAndIsString,
	existsAndIsNumber,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	validAttributes,
	validOperations,
	validDataTypes,
	existsAndIsAlphanumeric,
	checkIfStatus,
	checkIfAllowedDataTypeAndOperation,
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
		execute(getGame, req, res);
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

// [patch] /games/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:gameID/:attribute/:operation/:value",
	existsAndIsMongoID("gameID"),
	existsAndIsOneOfList("attribute", validAttributes.game),
	existsAndIsOneOfList("operation", validOperations),
	existsAndIsAlphanumeric("value"),
	checkIfAllowedDataTypeAndOperation("attribute", validDataTypes.game),
	checkIfStatus("attribute"),
	evaluateRules,
	async (req, res, next) => {
		execute(updateGameAttribute, req, res);
	}
);

export default router;

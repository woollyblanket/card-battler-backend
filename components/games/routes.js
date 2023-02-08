import express from "express";
import { Game } from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	checkIfEnumerated,
	checkParamCombination,
	evaluateRules,
	existsAndIsAlphanumeric,
	existsAndIsMongoID,
	existsAndIsOneOfList,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";
import { OPERATIONS } from "../../helpers/constants.js";
import { SCHEMA_PROPERTIES } from "../../helpers/schema.js";
import { deleteByID, getByID, getByIDAndUpdate } from "../../helpers/model.js";

const debug = createDebugMessages("backend:games:routes");

const router = express.Router();

// [get] /games/:id - get game of id
router.get(
	"/:gameID",
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getByID, [Game, req.params.gameID], req, res, next);
	}
);

// [delete] /games/:id - deletes the game
router.delete(
	"/:gameID",
	existsAndIsMongoID("gameID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(deleteByID, [Game, req.params.gameID], req, res, next);
	}
);

// [patch] /games/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:gameID/:attribute/:operation/:value",
	existsAndIsMongoID("gameID"),
	existsAndIsOneOfList("attribute", SCHEMA_PROPERTIES.game),
	existsAndIsOneOfList("operation", OPERATIONS),
	existsAndIsAlphanumeric("value"),
	checkParamCombination("games"),
	checkIfEnumerated("attribute", "status"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			getByIDAndUpdate,
			[
				Game,
				req.params.gameID,
				req.params.attribute,
				req.params.value,
				req.params.operation,
			],
			req,
			res,
			next
		);
	}
);

export default router;

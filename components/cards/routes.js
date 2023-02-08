import express from "express";
import { Card } from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	checkIfEnumerated,
	checkParamCombination,
	evaluateRules,
	existsAndIsAlphanumeric,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	existsAndIsString,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";
import { CARD_TYPES, OPERATIONS } from "../../helpers/constants.js";
import { SCHEMA_PROPERTIES } from "../../helpers/schema.js";
import {
	createWithData,
	deleteByID,
	getByID,
	getByIDAndUpdate,
} from "../../helpers/model.js";

const debug = createDebugMessages("backend:cards:routes");
const router = express.Router();

// [post] /cards - create a new card
router.post(
	"/",
	existsAndIsString("name"),
	existsAndIsOneOfList("type", CARD_TYPES),
	existsAndIsString("description"),
	evaluateRules,
	async (req, res, next) => {
		await execute(createWithData, [Card, req.body], req, res, next);
	}
);

// [get] /cards/:id - get card of id
router.get(
	"/:cardID",
	existsAndIsMongoID("cardID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getByID, [Card, req.params.cardID], req, res, next);
	}
);

// [patch] /cards/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:cardID/:attribute/:operation/:value",
	existsAndIsMongoID("cardID"),
	existsAndIsOneOfList("attribute", SCHEMA_PROPERTIES.card),
	existsAndIsOneOfList("operation", OPERATIONS),
	existsAndIsAlphanumeric("value"),
	checkParamCombination("cards"),
	checkIfEnumerated("attribute", "status"),
	checkIfEnumerated("attribute", "type", "cardType"),
	checkIfEnumerated("attribute", "rarity"),
	evaluateRules,
	async (req, res, next) => {
		await execute(
			getByIDAndUpdate,
			[
				Card,
				req.params.cardID,
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

// [delete] /cards/:id - deletes the card
router.delete(
	"/:cardID",
	existsAndIsMongoID("cardID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(deleteByID, [Card, req.params.cardID], req, res, next);
	}
);

export default router;

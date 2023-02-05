import express from "express";
import {
	createCard,
	deleteCard,
	getCard,
	updateCardAttribute,
	validCardTypes,
} from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	checkIfAllowedDataTypeAndOperation,
	checkIfCardType,
	checkIfRarity,
	checkIfStatus,
	evaluateRules,
	existsAndIsAlphanumeric,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	existsAndIsString,
	validAttributes,
	validDataTypes,
	validOperations,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:cards:routes");
const router = express.Router();

// [post] /cards - create a new card
router.post(
	"/",
	existsAndIsString("name"),
	existsAndIsOneOfList("type", validCardTypes),
	existsAndIsString("description"),
	evaluateRules,
	async (req, res, next) => {
		await execute(createCard, req, res, next);
	}
);

// [get] /cards/:id - get card of id
router.get(
	"/:cardID",
	existsAndIsMongoID("cardID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getCard, req, res, next);
	}
);

// [patch] /cards/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:cardID/:attribute/:operation/:value",
	existsAndIsMongoID("cardID"),
	existsAndIsOneOfList("attribute", validAttributes.card),
	existsAndIsOneOfList("operation", validOperations),
	existsAndIsAlphanumeric("value"),
	checkIfAllowedDataTypeAndOperation("attribute", validDataTypes.card),
	checkIfStatus("attribute"),
	checkIfCardType("attribute"),
	checkIfRarity("attribute"),
	evaluateRules,
	async (req, res, next) => {
		await execute(updateCardAttribute, req, res, next);
	}
);

// [delete] /cards/:id - deletes the card
router.delete(
	"/:cardID",
	existsAndIsMongoID("cardID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(deleteCard, req, res, next);
	}
);

export default router;

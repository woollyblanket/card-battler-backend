import express from "express";
import {
	createAbility,
	getAbility,
	updateAbilityAttribute,
	deleteAbility,
	validAbilityTypes,
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
	isNumber,
	isString,
	validDataTypes,
	existsAndIsAlphanumeric,
	checkIfAbilityType,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("backend:abilities:routes");
const router = express.Router();

// [post] /abilities - create a new ability
router.post(
	"/",
	existsAndIsString("name"),
	existsAndIsOneOfList("type", validAbilityTypes),
	existsAndIsString("description"),
	isNumber("duration"),
	isString("strength"),
	isString("energy"),
	isString("health"),
	isString("shield"),
	evaluateRules,
	async (req, res, next) => {
		await execute(createAbility, req, res, next);
	}
);

// [get] /abilities/:id - get ability of id
router.get(
	"/:abilityID",
	existsAndIsMongoID("abilityID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getAbility, req, res, next);
	}
);

// [patch] /abilities/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:abilityID/:attribute/:operation/:value",
	existsAndIsMongoID("abilityID"),
	existsAndIsOneOfList("attribute", validAttributes.ability),
	existsAndIsOneOfList("operation", validOperations),
	existsAndIsString("value"), // usually use alphanumeric here, but for abilities we can have symbols like + or -
	checkIfAllowedDataTypeAndOperation("attribute", validDataTypes.ability),
	checkIfStatus("attribute"),
	checkIfAbilityType("attribute"),
	evaluateRules,
	async (req, res, next) => {
		await execute(updateAbilityAttribute, req, res, next);
	}
);

// [delete] /abilities/:id - deletes the ability
router.delete(
	"/:abilityID",
	existsAndIsMongoID("abilityID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(deleteAbility, req, res, next);
	}
);

export default router;

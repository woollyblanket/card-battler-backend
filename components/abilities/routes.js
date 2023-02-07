import express from "express";
import {
	createAbility,
	deleteAbility,
	getAbility,
	updateAbilityAttribute,
} from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	checkIfEnumerated,
	checkParamCombination,
	evaluateRules,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	existsAndIsString,
	isNumber,
	isString,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";
import { ABILITY_TYPES, OPERATIONS } from "../../helpers/constants.js";
import { SCHEMA_PROPERTIES } from "../../helpers/schema.js";

const debug = createDebugMessages("backend:abilities:routes");
const router = express.Router();

// [post] /abilities - create a new ability
router.post(
	"/",
	existsAndIsString("name"),
	existsAndIsOneOfList("type", ABILITY_TYPES),
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
	existsAndIsOneOfList("attribute", SCHEMA_PROPERTIES.ability),
	existsAndIsOneOfList("operation", OPERATIONS),
	existsAndIsString("value"), // usually use alphanumeric here, but for abilities we can have symbols like + or -
	checkParamCombination("ability"),
	checkIfEnumerated("attribute", "status"),
	checkIfEnumerated("attribute", "type", "abilityType"),
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

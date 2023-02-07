import express from "express";
import {
	createCharacter,
	deleteCharacter,
	getCharacter,
	updateCharacterAttribute,
} from "./model.js";
import { execute } from "../../helpers/routes.js";
import {
	checkParamCombination,
	evaluateRules,
	existsAndIsAlphanumeric,
	existsAndIsMongoID,
	existsAndIsOneOfList,
	existsAndIsString,
	isArrayOfObjectIDs,
	isNumber,
	isString,
} from "../../helpers/validation.js";
import createDebugMessages from "debug";
import { OPERATIONS } from "../../helpers/constants.js";
import { SCHEMA_PROPERTIES } from "../../helpers/schema.js";

const debug = createDebugMessages("backend:characters:routes");
const router = express.Router();

// [post] /characters - create a new character
router.post(
	"/",
	isString("name"),
	existsAndIsString("archetype"),
	existsAndIsString("description"),
	isNumber("health"),
	isNumber("energy"),
	isArrayOfObjectIDs("abilities"),
	evaluateRules,
	async (req, res, next) => {
		await execute(createCharacter, req, res, next);
	}
);

// [get] /characters/:id - get character of id
router.get(
	"/:characterID",
	existsAndIsMongoID("characterID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getCharacter, req, res, next);
	}
);

// [patch] /characters/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:characterID/:attribute/:operation/:value",
	existsAndIsMongoID("characterID"),
	existsAndIsOneOfList("attribute", SCHEMA_PROPERTIES.character),
	existsAndIsOneOfList("operation", OPERATIONS),
	existsAndIsAlphanumeric("value"),
	checkParamCombination("character"),
	evaluateRules,
	async (req, res, next) => {
		await execute(updateCharacterAttribute, req, res, next);
	}
);

// [delete] /characters/:id - deletes the character
router.delete(
	"/:characterID",
	existsAndIsMongoID("characterID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(deleteCharacter, req, res, next);
	}
);

export default router;

import express from "express";
import {
	createEnemy,
	deleteEnemy,
	getEnemy,
	updateEnemyAttribute,
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

const debug = createDebugMessages("backend:enemies:routes");
const router = express.Router();

// [post] /enemies - create a new enemy
router.post(
	"/",
	isString("name"),
	existsAndIsString("species"),
	existsAndIsString("description"),
	isNumber("health"),
	isNumber("energy"),
	isArrayOfObjectIDs("abilities"),
	evaluateRules,
	async (req, res, next) => {
		await execute(createEnemy, req, res, next);
	}
);

// [get] /enemies/:id - get enemy of id
router.get(
	"/:enemyID",
	existsAndIsMongoID("enemyID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(getEnemy, req, res, next);
	}
);

// [patch] /enemies/:id/:attribute/:operation/:amount - updates the property, using the operation and the amount
router.patch(
	"/:enemyID/:attribute/:operation/:value",
	existsAndIsMongoID("enemyID"),
	existsAndIsOneOfList("attribute", SCHEMA_PROPERTIES.enemy),
	existsAndIsOneOfList("operation", OPERATIONS),
	existsAndIsAlphanumeric("value"),
	checkParamCombination("enemy"),
	evaluateRules,
	async (req, res, next) => {
		await execute(updateEnemyAttribute, req, res, next);
	}
);

// [delete] /enemies/:id - deletes the enemy
router.delete(
	"/:enemyID",
	existsAndIsMongoID("enemyID"),
	evaluateRules,
	async (req, res, next) => {
		await execute(deleteEnemy, req, res, next);
	}
);

export default router;

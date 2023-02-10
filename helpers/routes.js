// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import {
	createWithData,
	deleteByID,
	getAll,
	getByID,
	getByIDAndUpdate,
	getModelFromName,
} from "./model.js";
import { validate } from "./validation.evaluate.js";
import {
	checkModel,
	checkParamCombination,
	isValidEntity,
} from "./validation.custom.js";
import { existsAndIsMongoID } from "./validation.standard.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:helpers:routes");
const router = express.Router();

// PUBLIC 				///////////////////////////////////////////
export const execute = async (action, params, req, res, next) => {
	try {
		const entity = await action(params);

		debug("%O", entity);

		if (entity.error) {
			res.formatter.ok({
				message: entity.error,
				success: false,
			});
		} else {
			switch (req.method) {
				case "POST":
					res.formatter.created(entity);
					break;

				default:
					res.formatter.ok(entity);
					break;
			}
		}
	} catch (error) {
		next(error);
	}
};

// standard CRUD operations at the root level

// [post] /:entities - create a new entity
// e.g. [post] /players - create a new player
router.post(
	"/:entities",
	validate([isValidEntity("entities"), checkModel("entities")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(createWithData, [model, req.body], req, res, next);
	}
);

// [get] /:entities/:id - get an entity
// e.g. [get] /players/:id - get a player
router.get(
	"/:entities/:id",
	validate([isValidEntity("entities"), existsAndIsMongoID("id")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(getByID, [model, req.params.id], req, res, next);
	}
);

// [get] /:entities - get all entities
// e.g. [get] /players - get all player
router.get(
	"/:entities",
	validate([isValidEntity("entities")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(getAll, [model], req, res, next);
	}
);

// [patch] /:entities/:id/:attribute/:operation/:value - update entity in place
// e.g. [patch] /players/:id/:attribute/:operation/:value - update player in place
router.patch(
	"/:entities/:id/:attribute/:operation/:value",
	validate([
		isValidEntity("entities"),
		existsAndIsMongoID("id"),
		checkParamCombination(),
	]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(
			getByIDAndUpdate,
			[
				model,
				req.params.id,
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

// [delete] /:entities/:id - delete an entity
// e.g. [delete] /players/:id - delete a player
router.delete(
	"/:entities/:id",
	validate([isValidEntity("entities"), existsAndIsMongoID("id")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(deleteByID, [model, req.params.id], req, res, next);
	}
);

export default router;

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
import { generateToken } from "../middleware/csrf.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:helpers:routes");
const crud = express.Router();
const csrf = express.Router();

// PUBLIC 				///////////////////////////////////////////
export const execute = async (action, params, req, res, next) => {
	try {
		const entity = await action(params);

		debug("%O", entity);

		if (entity.error) {
			res.formatter.badRequest({
				message: entity.error.message,
				success: false,
			});
		} else {
			if (req.method === "POST") {
				res.formatter.created(entity);
			} else {
				res.formatter.ok(entity);
			}
		}
	} catch (error) {
		next(error);
	}
};

// standard CRUD operations at the root level

// [post] /:entities - create a new entity
// e.g. [post] /players - create a new player
crud.post(
	"/:entities",
	validate([isValidEntity("entities"), checkModel("entities")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(createWithData, [model, req.body], req, res, next);
	}
);

// [get] /:entities/:id - get an entity
// e.g. [get] /players/:id - get a player
crud.get(
	"/:entities/:id",
	validate([isValidEntity("entities"), existsAndIsMongoID("id")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(getByID, [model, req.params.id], req, res, next);
	}
);

// [get] /:entities - get all entities
// e.g. [get] /players - get all player
crud.get(
	"/:entities",
	validate([isValidEntity("entities")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(getAll, [model], req, res, next);
	}
);

// [patch] /:entities/:id/:attribute/:operation/:value - update entity in place
// e.g. [patch] /players/:id/:attribute/:operation/:value - update player in place
crud.patch(
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
crud.delete(
	"/:entities/:id",
	validate([isValidEntity("entities"), existsAndIsMongoID("id")]),
	async (req, res, next) => {
		const model = getModelFromName(req.params.entities);
		await execute(deleteByID, [model, req.params.id], req, res, next);
	}
);

csrf.get("/", async (req, res, next) => {
	try {
		const csrfToken = generateToken(req);
		res.formatter.ok({
			message: `Generated token`,
			success: true,
			entity: csrfToken,
		});
	} catch (error) {
		return { error };
	}
});

export { crud, csrf };

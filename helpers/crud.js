import Router from "@koa/router";
import { isValidEntity } from "./joi.custom.js";
import {
	entitySchema,
	getPatchSchemaForEntityName,
	getValidationSchemaByName,
	objectIdSchema,
} from "./joi.schemas.js";
import createDebugMessages from "debug";
import { getErrorResponse } from "./joi.validator.js";
import {
	createWithData,
	deleteByID,
	getAll,
	getByID,
	getByIDAndUpdate,
	getModelFromName,
} from "./model.js";
import { createErrorResponse, doAction } from "./koa.actions.js";

const debug = createDebugMessages("battler:backend:helpers:crud");
export const crud = new Router();

crud.param("entities", async (entity, ctx, next) => {
	return (
		(await getErrorResponse(
			entity,
			entitySchema.custom(isValidEntity),
			404,
			ctx
		)) || next()
	);
});

crud.param("id", async (id, ctx, next) => {
	return (await getErrorResponse(id, objectIdSchema, 404, ctx)) || next();
});

crud.post("/:entities", async (ctx) => {
	const schema = await getValidationSchemaByName(ctx.params.entities);
	const errorResponse = await getErrorResponse(
		ctx.request.body,
		schema,
		400,
		ctx
	);

	if (errorResponse) {
		// problems
		return errorResponse;
	} else {
		// all good
		const model = getModelFromName(ctx.params.entities);
		return await doAction(
			createWithData,
			[model, ctx.request.body],
			201,
			ctx
		);
	}
});

crud.get("/:entities/:id", async (ctx) => {
	const model = getModelFromName(ctx.params.entities);
	return await doAction(getByID, [model, ctx.params.id], 200, ctx);
});

crud.get("/:entities", async (ctx, next) => {
	const model = getModelFromName(ctx.params.entities);
	return await doAction(getAll, [model], 200, ctx);
});

crud.patch("/:entities/:id/:attribute/:operation/:value", async (ctx, next) => {
	try {
		// this could fail if the attribute doesn't exist in the entity
		const schema = await getPatchSchemaForEntityName(
			ctx.params.entities,
			ctx.params.attribute
		);

		const errorResponse = await getErrorResponse(
			{
				attribute: ctx.params.attribute,
				value: ctx.params.value,
				operation: ctx.params.operation,
			},
			schema,
			400,
			ctx
		);

		if (errorResponse) {
			// problems
			return errorResponse;
		} else {
			// all good
			const model = getModelFromName(ctx.params.entities);
			return await doAction(
				getByIDAndUpdate,
				[
					model,
					ctx.params.id,
					ctx.params.attribute,
					ctx.params.value,
					ctx.params.operation,
				],
				200,
				ctx
			);
		}
	} catch (error) {
		return createErrorResponse(ctx, 400, error);
	}
});

crud.del("/:entities/:id", async (ctx, next) => {
	const model = getModelFromName(ctx.params.entities);
	return await doAction(deleteByID, [model, ctx.params.id], 200, ctx);
});

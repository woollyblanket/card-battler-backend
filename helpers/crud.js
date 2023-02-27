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
} from "./model.js";
import { doAction } from "./koa.actions.js";

const debug = createDebugMessages("battler:backend:helpers:crud");
export const crud = new Router();

crud.param("entities", (entity, ctx, next) => {
	return (
		getErrorResponse(
			entity,
			entitySchema.custom(isValidEntity),
			404,
			ctx
		) || next()
	);
});

crud.param("id", (id, ctx, next) => {
	return getErrorResponse(id, objectIdSchema, 404, ctx) || next();
});

crud.post("/:entities", async (ctx) => {
	const schema = await getValidationSchemaByName(ctx.params.entities);
	const errorResponse = getErrorResponse(ctx.request.body, schema, 400, ctx);

	if (errorResponse) {
		// problems
		return errorResponse;
	} else {
		// all good
		return await doAction(
			ctx.params.entities,
			createWithData,
			[ctx.request.body],
			201,
			ctx
		);
	}
});

crud.get("/:entities/:id", async (ctx) => {
	return await doAction(
		ctx.params.entities,
		getByID,
		[ctx.params.id],
		200,
		ctx
	);
});

crud.get("/:entities", async (ctx, next) => {
	return await doAction(ctx.params.entities, getAll, [], 200, ctx);
});

crud.patch("/:entities/:id/:attribute/:operation/:value", async (ctx, next) => {
	try {
		// this could fail if the attribute doesn't exist in the entity
		const schema = await getPatchSchemaForEntityName(
			ctx.params.entities,
			ctx.params.attribute
		);

		const errorResponse = getErrorResponse(
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
			return await doAction(
				ctx.params.entities,
				getByIDAndUpdate,
				[
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
		ctx.body = {
			message: `${error.name}: ${error.message}`,
			success: false,
		};
		ctx.status = 400;
	}
});

crud.del("/:entities/:id", async (ctx, next) => {
	return await doAction(
		ctx.params.entities,
		deleteByID,
		[ctx.params.id],
		200,
		ctx
	);
});

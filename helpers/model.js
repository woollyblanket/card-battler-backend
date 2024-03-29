// EXTERNAL IMPORTS		///////////////////////////////////////////
import createDebugMessages from "debug";
import mongoose from "mongoose";
import pluralize from "pluralize";
import _ from "lodash";
import { sentenceCase } from "change-case";
import { NotFoundError } from "./errors.js";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:helpers:model");

const setFieldIfUndefined = async (item, updateField, updateValue, model) => {
	const defaultValues = {
		objectid: updateValue,
		number: 0,
		string: "",
		array: [],
		object: {},
	};

	if (item[updateField] === undefined) {
		debug(`${updateField} isn't set. Creating first, then updating`);

		const dataType = getModelDataTypes(model.schema.obj)[updateField].type;

		item[updateField] = defaultValues[dataType];

		item = await item.save();
	}
	return item[updateField] === undefined;
};

const buildMessage = (
	item,
	inputs,
	wasUndefined,
	validOperation,
	oldVal,
	oldValSize,
	model
) => {
	let message = "";
	const { updateField, updateOperation, updateValue } = inputs;
	const newVal = item[updateField];
	const newValSize = item[updateField].length;

	if (validOperation) {
		let diff = "";

		if (wasUndefined) oldVal = "<blank>";

		if (Array.isArray(item[updateField])) {
			const text = { add: "Added", remove: "Removed" };
			diff += `Size: ${oldValSize} -> ${newValSize}. ${text[updateOperation]}: ${updateValue}`;
		} else {
			diff += `${oldVal} -> ${newVal}`;
		}

		message = `Updated the ${updateField} (${diff}) on ${model.modelName.toLowerCase()}: ${
			item._id
		}`;
	} else {
		message = `Invalid operation type: ${updateOperation}`;
	}
	return message;
};

const doAdd = (fieldToUpdate, valueToAdd) => {
	// can add integers together or add an item to an array
	try {
		let newValue = fieldToUpdate;

		if (Number.isInteger(fieldToUpdate)) {
			if (isNaN(parseInt(valueToAdd))) {
				throw new Error(`${valueToAdd} isn't a number`);
			}
			newValue += parseInt(valueToAdd);
		} else if (Array.isArray(fieldToUpdate)) {
			newValue.push(valueToAdd);
		} else {
			throw new Error(`${fieldToUpdate} isn't an integer or array`);
		}
		return newValue;
	} catch (error) {
		return { error };
	}
};

const doSubtract = (fieldToUpdate, valueToSubtract) => {
	try {
		let newValue = fieldToUpdate;
		if (!Number.isInteger(fieldToUpdate)) {
			throw new Error(`${fieldToUpdate} isn't an integer`);
		}
		if (isNaN(parseInt(valueToSubtract))) {
			throw new Error(`${valueToSubtract} isn't a number`);
		}
		newValue -= parseInt(valueToSubtract);
		return newValue;
	} catch (error) {
		return { error };
	}
};

const doRemove = (fieldToUpdate, valueToRemove) => {
	try {
		let newArray = fieldToUpdate;
		if (!Array.isArray(fieldToUpdate)) {
			throw new Error(`${fieldToUpdate} isn't an array`);
		}
		const index = fieldToUpdate.indexOf(valueToRemove);
		if (index > -1) {
			newArray.splice(index, 1);
		}
		return newArray;
	} catch (error) {
		return { error };
	}
};

const doOperation = (item, updateField, updateOperation, updateValue) => {
	let validOperation = true;
	let result = item[updateField];

	switch (updateOperation) {
		case "add": {
			result = doAdd(item[updateField], updateValue);
			break;
		}
		case "subtract": {
			result = doSubtract(item[updateField], updateValue);
			break;
		}
		case "assign": {
			result = updateValue;
			break;
		}
		case "remove": {
			result = doRemove(item[updateField], updateValue);
			break;
		}
		default: {
			// do nothing
			validOperation = false;
			break;
		}
	}

	if (!result.error) item[updateField] = result;

	return { validOperation, error: result.error };
};

export const buildResponse = (message, success, data) => {
	if (_.isArray(data)) {
		return { message, success, entities: data };
	}
	return { message, success, entity: data };
};

// PUBLIC 				///////////////////////////////////////////
export const stripPassword = (data) => {
	let returnData;
	if (_.isArray(data)) {
		returnData = [];
		for (const item of data) {
			returnData.push(_.omit(item.toObject(), ["password"]));
		}
	} else {
		returnData = _.omit(data.toObject(), ["password"]);
	}

	return returnData;
};

export const getByID = async ([mongooseModel, id]) => {
	try {
		const item = await mongooseModel.findById(id).exec();

		if (!item) {
			throw new NotFoundError(
				`Couldn't find the ${mongooseModel.modelName.toLowerCase()}`
			);
		}

		return buildResponse(
			`Fetched the ${mongooseModel.modelName.toLowerCase()}: ${item._id}`,
			true,
			item
		);
	} catch (error) {
		return { error };
	}
};

export const getByField = async ([mongooseModel, field, value]) => {
	try {
		const item = await mongooseModel.findOne({ [field]: value }).exec();
		if (!item) {
			throw new NotFoundError(
				`Couldn't find the ${mongooseModel.modelName.toLowerCase()}`
			);
		}

		return buildResponse(
			`Fetched the ${mongooseModel.modelName.toLowerCase()}: ${
				item[field]
			}`,
			true,
			item
		);
	} catch (error) {
		return { error };
	}
};

export const getAll = async ([mongooseModel]) => {
	try {
		const items = await mongooseModel.find().exec();
		if (!items) {
			throw new NotFoundError(
				`Couldn't find any ${mongooseModel.modelName.toLowerCase()}s`
			);
		}

		return buildResponse(
			`Fetched all the ${mongooseModel.modelName.toLowerCase()}s`,
			true,
			items
		);
	} catch (error) {
		return { error };
	}
};

export const getAllEntitiesForID = async ([
	parentModel,
	parentID,
	childModel,
	childField,
]) => {
	try {
		const item1 = await parentModel.findById(parentID).exec();
		if (!item1) {
			throw new NotFoundError(
				`Couldn't find the ${parentModel.modelName.toLowerCase()}`
			);
		}

		const items = await childModel.find({
			[childField]: parentID,
		});
		if (!items) {
			throw new NotFoundError(
				`Couldn't find the ${childModel.modelName.toLowerCase()}`
			);
		}

		return buildResponse(
			`Fetched all ${childModel.modelName.toLowerCase()}s associated with the ${parentModel.modelName.toLowerCase()} (${parentID})`,
			true,
			items
		);
	} catch (error) {
		return { error };
	}
};

export const resolveIDsToEntities = async ([
	parentModel,
	parentID,
	parentField,
	childModel,
]) => {
	try {
		const item = await parentModel.findById(parentID).exec();
		if (!item)
			throw new NotFoundError(
				`Couldn't find the ${parentModel.modelName.toLowerCase()}`
			);

		const items = await childModel.find({ _id: item[parentField] });
		if (!items)
			throw new NotFoundError(
				`Couldn't find the ${childModel.modelName.toLowerCase()}`
			);

		return buildResponse(
			`Fetched all ${childModel.modelName.toLowerCase()}s associated with the ${parentModel.modelName.toLowerCase()} (${parentID})`,
			true,
			items
		);
	} catch (error) {
		return { error };
	}
};

export const getEntityForID = async ([
	referenceModel,
	referenceID,
	lookupModel,
	lookupID,
	fieldInLookup,
]) => {
	// finds the lookupID, and checks if it has the referenceID in its fieldInLookup
	// as in, is the referenceID allowed to know about the lookupID?
	try {
		const item = await lookupModel.findById(lookupID).exec();
		if (!item)
			throw new NotFoundError(
				`Couldn't find the ${lookupModel.modelName.toLowerCase()}`
			);

		if (item[fieldInLookup].toString() !== referenceID.toString())
			throw new Error(
				`That ${lookupModel.modelName.toLowerCase()} is not associated with that ${referenceModel.modelName.toLowerCase()}`
			);

		return buildResponse(
			`Fetched the ${lookupModel.modelName.toLowerCase()} (${lookupID}) associated with the ${referenceModel.modelName.toLowerCase()} (${referenceID})`,
			true,
			item
		);
	} catch (error) {
		return { error };
	}
};

export const getByIDAndUpdate = async ([
	mongooseModel,
	id,
	updateField,
	updateValue,
	updateOperation,
]) => {
	try {
		let item = await mongooseModel.findById(id).exec();
		if (!item)
			throw new NotFoundError(
				`Couldn't find the ${mongooseModel.modelName.toLowerCase()}`
			);

		// casting to bool if appropriate
		if (updateValue === "true") updateValue = true;
		if (updateValue === "false") updateValue = false;

		const wasUndefined = await setFieldIfUndefined(
			item,
			updateField,
			updateValue,
			mongooseModel
		);

		let oldVal, oldValSize;

		if (Array.isArray(item[updateField])) {
			oldVal = item[updateField].join(", ");
			oldValSize = item[updateField].length;
		} else {
			// So no pass by reference, casting to string. That's all I need out of these variables anyway
			oldVal = item[updateField].toString();
			oldValSize = oldVal.length.toString();
		}

		const result = doOperation(
			item,
			updateField,
			updateOperation,
			updateValue
		);
		if (result.error) throw result.error;

		const message = buildMessage(
			item,
			{ updateField, updateOperation, updateValue },
			wasUndefined,
			result.validOperation,
			oldVal,
			oldValSize,
			mongooseModel
		);

		await item.save();

		return buildResponse(message, true, item);
	} catch (error) {
		return { error };
	}
};

export const deleteByID = async ([mongooseModel, id]) => {
	try {
		const item = await mongooseModel.findByIdAndDelete(id).exec();
		if (!item)
			throw new NotFoundError(
				`Couldn't find the ${mongooseModel.modelName.toLowerCase()}`
			);
		return buildResponse(
			`Deleted the ${mongooseModel.modelName.toLowerCase()}: ${item._id}`,
			true,
			item
		);
	} catch (error) {
		return { error };
	}
};

export const createByField = async ([mongooseModel, field, value]) => {
	try {
		const item = await mongooseModel.create({ [field]: value });

		if (!item)
			throw new Error(
				`Couldn't create the ${mongooseModel.modelName.toLowerCase()}`
			);

		return buildResponse(
			`Created a ${mongooseModel.modelName.toLowerCase()} (${value})`,
			true,
			stripPassword(item)
		);
	} catch (error) {
		return { error };
	}
};

export const createWithData = async ([mongooseModel, data]) => {
	try {
		const item = await mongooseModel.create(data);

		if (!item)
			throw new Error(
				`Couldn't create the ${mongooseModel.modelName.toLowerCase()}`
			);

		return buildResponse(
			`Created a ${mongooseModel.modelName.toLowerCase()} with data: ${JSON.stringify(
				_.omit(data, ["password"])
			)}`,
			true,
			stripPassword(item)
		);
	} catch (error) {
		return { error };
	}
};

export const createForID = async ([
	lookupModel,
	lookupID,
	ownerModel,
	referenceField,
]) => {
	try {
		const item1 = await lookupModel.findById(lookupID).exec();
		if (!item1)
			throw new NotFoundError(
				`Couldn't find the ${lookupModel.modelName.toLowerCase()}`
			);

		const item2 = await ownerModel.create({
			[referenceField]: lookupID,
		});
		if (!item2)
			throw new Error(
				`Couldn't create the ${ownerModel.modelName.toLowerCase()}`
			);

		return buildResponse(
			`Created a ${ownerModel.modelName.toLowerCase()} (${
				item2._id
			}) for ${lookupModel.modelName.toLowerCase()}: ${lookupID}`,
			true,
			stripPassword(item2)
		);
	} catch (error) {
		return { error };
	}
};

export const getModelDataTypes = (schemaObject) => {
	let dataTypes = {};
	Object.keys(schemaObject).forEach((key) => {
		dataTypes[key] = {};

		let check;
		if (_.isArray(schemaObject[key])) {
			dataTypes[key]["array"] = true;
			check = schemaObject[key][0].type;
		} else {
			check = schemaObject[key].type;
		}

		if (_.isString(check)) {
			// we've got the type straight away
			dataTypes[key]["type"] = check.toLowerCase();
		} else if (_.isFunction(check)) {
			dataTypes[key]["type"] = check.name.toLowerCase();
		} else if (_.isUndefined(check)) {
			debug(
				"Type is undefined. Key is %o. Assuming data type is object",
				key
			);
			dataTypes[key]["object"] = true;
			dataTypes[key]["type"] = "object";
		} else {
			debug("Can't figure out data type of %o", check);
		}
	});
	return dataTypes;
};

export const getModelFromName = (modelName) => {
	modelName = sentenceCase(modelName);
	modelName = pluralize.singular(modelName);
	return mongoose.model(modelName);
};

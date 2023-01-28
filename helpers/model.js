import createDebugMessages from "debug";

const debug = createDebugMessages("backend:helper:model");

export const getByID = async (mongooseModel, id) => {
	try {
		const item = await mongooseModel.findById(id).exec();
		if (!item)
			throw `Couldn't find the ${mongooseModel.modelName.toLowerCase()}`;
		return {
			message: `Fetched the ${mongooseModel.modelName.toLowerCase()}: ${
				item._id
			}`,
			success: true,
			entity: item,
		};
	} catch (error) {
		return { error };
	}
};

export const getByField = async (mongooseModel, field, value) => {
	try {
		const item = await mongooseModel.findOne({ [field]: value }).exec();
		if (!item)
			throw `Couldn't find the ${mongooseModel.modelName.toLowerCase()}`;
		return {
			message: `Fetched the ${mongooseModel.modelName.toLowerCase()}: ${
				item[field]
			}`,
			success: true,
			entity: item,
		};
	} catch (error) {
		return { error };
	}
};

export const getAll = async (mongooseModel) => {
	try {
		const items = await mongooseModel.find().exec();
		if (!items)
			throw `Couldn't find any ${mongooseModel.modelName.toLowerCase()}s`;
		return {
			message: `Fetched all the ${mongooseModel.modelName.toLowerCase()}s`,
			success: true,
			entities: items,
		};
	} catch (error) {
		return { error };
	}
};

export const getAllEntitiesForID = async (
	mongooseModel1,
	id,
	mongooseModel2,
	field
) => {
	try {
		const item1 = await mongooseModel1.findById(id).exec();
		if (!item1)
			throw `Couldn't find the ${mongooseModel1.modelName.toLowerCase()}`;
		const items = await mongooseModel2.find({ [field]: id });
		if (!items)
			throw `Couldn't find the ${mongooseModel2.modelName.toLowerCase()}`;
		return {
			message: `Fetched all ${mongooseModel2.modelName.toLowerCase()}s associated with the ${mongooseModel1.modelName.toLowerCase()} (${id})`,
			success: true,
			entities: items,
		};
	} catch (error) {
		return { error };
	}
};

export const getEntityForID = async (
	mongooseModel1,
	id1,
	mongooseModel2,
	id2,
	field
) => {
	try {
		const item = await mongooseModel2.findById(id2).exec();
		if (!item)
			throw `Couldn't find the ${mongooseModel2.modelName.toLowerCase()}`;

		if (item[field].toString() !== id1)
			throw `That ${mongooseModel2.modelName.toLowerCase()} is not associated with that ${mongooseModel1.modelName.toLowerCase()}`;

		return {
			message: `Fetched the ${mongooseModel2.modelName.toLowerCase()} (${id2}) associated with the ${mongooseModel1.modelName.toLowerCase()} (${id1})`,
			success: true,
			entity: item,
		};
	} catch (error) {
		return { error };
	}
};

export const getByIDAndUpdate = async (
	mongooseModel,
	id,
	updateField,
	updateValue,
	updateOperation
) => {
	try {
		// debug("params %O", {
		// 	mongooseModel,
		// 	id,
		// 	updateField,
		// 	updateValue,
		// 	updateOperation,
		// });
		const item = await mongooseModel.findById(id).exec();
		if (!item)
			throw `Couldn't find the ${mongooseModel.modelName.toLowerCase()}`;

		let oldVal, oldValSize;

		if (Array.isArray(item[updateField])) {
			oldVal = item[updateField].join(", ");
			oldValSize = item[updateField].length;
		} else {
			// So no pass by reference, casting to string. That's all I need out of these variables anyway
			oldVal = item[updateField].toString();
			oldValSize = oldVal.length.toString();
		}

		let validOperation = true;

		switch (updateOperation) {
			case "add":
				// can add integers together or add an item to an array
				if (Number.isInteger(item[updateField])) {
					item[updateField] += parseInt(updateValue);
				} else if (Array.isArray(item[updateField])) {
					item[updateField].push(updateValue);
				} else {
					throw `${item[updateField]} isn't an integer or array`;
				}

				break;

			case "subtract":
				if (!Number.isInteger(item[updateField]))
					throw `${item[updateField]} isn't an integer`;
				item[updateField] -= parseInt(updateValue);
				break;

			case "assign":
				item[updateField] = updateValue;
				break;

			case "remove":
				if (!Array.isArray(item[updateField]))
					throw `${item[updateField]} isn't an array`;
				const index = item[updateField].indexOf(updateValue);
				if (index > -1) {
					item[updateField].splice(index, 1);
				}
				break;

			default:
				// do nothing
				validOperation = false;
				break;
		}

		const newVal = item[updateField];
		const newValSize = item[updateField].length;

		let message = "";

		if (validOperation) {
			let diff = "";

			if (Array.isArray(item[updateField])) {
				const text = { add: "Added", remove: "Removed" };
				diff = `Size: ${oldValSize} -> ${newValSize}. ${text[updateOperation]}: ${updateValue}`;
			} else {
				diff = `${oldVal} -> ${newVal}`;
			}

			message = `Updated the ${updateField} (${diff}) on ${mongooseModel.modelName.toLowerCase()}: ${
				item._id
			}`;
		} else {
			message = `Invalid operation type: ${updateOperation}`;
		}

		await item.save();
		return {
			message,
			success: true,
			entity: item,
		};
	} catch (error) {
		return { error };
	}
};

export const deleteByID = async (mongooseModel, id) => {
	try {
		const item = await mongooseModel.findByIdAndDelete(id).exec();
		if (!item)
			throw `Couldn't find the ${mongooseModel.modelName.toLowerCase()}`;
		return {
			message: `Deleted the ${mongooseModel.modelName.toLowerCase()}: ${
				item._id
			}`,
			success: true,
			entity: item,
		};
	} catch (error) {
		return { error };
	}
};

export const createByField = async (mongooseModel, field, value) => {
	try {
		const exists = await mongooseModel.exists({ [field]: value });
		if (exists)
			throw `${mongooseModel.modelName} (${value}) already exists`;

		const item = await mongooseModel.create({ [field]: value });
		if (!item)
			throw `Couldn't create the ${mongooseModel.modelName.toLowerCase()}`;

		return {
			message: `Created a ${mongooseModel.modelName.toLowerCase()} (${value})`,
			success: true,
			entity: item,
		};
	} catch (error) {
		return { error };
	}
};

export const createForID = async (
	mongooseModel1,
	id,
	mongooseModel2,
	field
) => {
	try {
		const item1 = await mongooseModel1.findById(id).exec();
		if (!item1)
			throw `Couldn't find the ${mongooseModel1.modelName.toLowerCase()}`;

		const item2 = await mongooseModel2.create({ [field]: id });
		if (!item2)
			throw `Couldn't create the ${mongooseModel2.modelName.toLowerCase()}`;

		return {
			message: `Created a ${mongooseModel2.modelName.toLowerCase()} (${
				item2._id
			}) for ${mongooseModel1.modelName.toLowerCase()}: ${id}`,
			success: true,
			entity: item2,
		};
	} catch (error) {
		return { error };
	}
};

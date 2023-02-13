// EXTERNAL IMPORTS		///////////////////////////////////////////
import _ from "lodash";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
// schemas can have a few different formats
// return a consistent format
export const normaliseSchema = (schemaObj) => {
	let normalised = {};
	for (const [key, value] of Object.entries(schemaObj)) {
		let type;
		let isArray = false;
		let details = value;

		if (_.isArray(value)) {
			details = value[0];
			isArray = true;
		}

		if (_.isString(details.type)) type = details.type.toLowerCase();
		if (_.isFunction(details.type)) type = details.type.name.toLowerCase();

		normalised[key] = {
			type,
			isArray,
			enum: details.enum,
			required: details.required || false,
			unique: details.unique || false,
		};
	}
	return normalised;
};

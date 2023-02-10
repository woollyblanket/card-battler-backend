// EXTERNAL IMPORTS		///////////////////////////////////////////
import _ from "underscore";

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
// schemas can have a few different formats
// return a consistent format
export const normaliseSchema = (schemaObj) => {
	let normalised = {};
	for (const key in schemaObj) {
		if (Object.hasOwnProperty.call(schemaObj, key)) {
			let element = schemaObj[key];
			let type;
			let isArray = false;

			if (_.isArray(element)) {
				element = element[0];
				isArray = true;
			}

			if (_.isString(element.type)) type = element.type.toLowerCase();
			if (_.isFunction(element.type))
				type = element.type.name.toLowerCase();

			normalised[key] = {
				type,
				isArray,
				enum: element.enum,
				required: element.required || false,
				unique: element.unique || false,
			};
		}
	}
	return normalised;
};

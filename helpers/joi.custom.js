import pluralize from "pluralize";
import { getModelFromName } from "./model.js";
import createDebugMessages from "debug";

const debug = createDebugMessages("battler:backend:helpers:joi:custom");

export const isValidEntity = (value, helpers) => {
	// only allow plural paths
	// don't want people to use /card instead of /cards as
	// it's less RESTful

	if (pluralize.isSingular(value)) {
		throw new Error(`entity (${value}) must be plural`);
	}

	try {
		getModelFromName(value);
	} catch (error) {
		debug(error);
		throw new Error(`entity (${value}) does not exist`);
	}
	return true;
};

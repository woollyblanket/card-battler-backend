// EXTERNAL IMPORTS		///////////////////////////////////////////
import path from "path";
import glob from "glob";
import pluralize from "pluralize";
import mongoose from "mongoose";
import createDebugMessages from "debug";
import { ObjectId } from "mongodb";
import { createHash } from "crypto";
import { sentenceCase } from "change-case";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { dbConnect, dbConnectTest } from "./db.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:helpers:seeder");

const parseConfig = (config) => {
	// normalise everything to lower case
	config = config.toLowerCase();

	const skipValues = ["skip", "false", undefined];

	// default is to skip
	const data = {
		command: "skip",
	};

	if (skipValues.includes(config)) {
		return data;
	}
	data.command = config.split(":")[0];
	const options = config.split(":")[1];

	if (data.command === "drop") {
		// make collections singular as the model name is singular
		const collections = options.split(",");

		data.collections = collections.map((item) => pluralize.singular(item));
	}

	return data;
};

const connectToDbIfNeeded = async () => {
	if (mongoose.connection.readyState === 0) {
		/* c8 ignore start */
		if (process.env.NODE_ENV === "test") {
			await dbConnectTest();
		} else {
			await dbConnect();
		}
		/* c8 ignore stop */
	}

	if (mongoose.connection.readyState !== 1)
		throw new Error("Couldn't connect to DB");
};

const doDrop = async (droppedSet, modelName, config, model) => {
	// already dropped
	if (droppedSet.get(modelName)) return;
	if (
		config.collections[0] === "all" ||
		config.collections.includes(modelName)
	) {
		await model.deleteMany();
		debug("Deleted everything from %O", pluralize(model.collection.name));
	}

	return modelName;
};

const checkIfAllowedFile = (filePath) => {
	// when running tests, only use the test folder
	// otherwise, ignore the test folder
	return (
		/* c8 ignore next */
		(process.env.NODE_ENV === "test" && filePath.includes("test")) ||
		(process.env.NODE_ENV !== "test" && !filePath.includes("test"))
	);
};

// PUBLIC 				///////////////////////////////////////////

export const getObjectId = (name) => {
	if (!name) throw new Error("Name cannot be empty");

	// deepcode ignore InsecureHash: not used for secrets
	const hash = createHash("sha1").update(name, "utf8").digest("hex");

	return new ObjectId(hash.substring(0, 24));
};

export const getObjectIds = (names) => {
	if (!names) throw new Error("Names cannot be empty");
	if (!Array.isArray(names)) throw new Error("Names must be an array");
	return names.map((name) => getObjectId(name));
};

export const seed = async (configuration) => {
	try {
		const config = parseConfig(configuration);

		if (config.command === "skip") {
			debug("Skipping seeding");
			return;
		}

		if (config.command !== "drop") {
			// skip for now
			debug("Skipping seeding. Unrecognised command");
			return;
		}

		// make sure we're connected to the db
		await connectToDbIfNeeded();

		let alreadyDropped = new Map();
		const files = glob.sync("./seed-data/**/*.js");

		for (const file of files) {
			// skip this loop if we don't have a file we like
			const goodToContinue = checkIfAllowedFile(path.dirname(file));
			if (!goodToContinue) continue;

			const obj = await import(path.resolve(file));
			const { modelName, data } = obj.default;
			const lowerCaseModelName = modelName.toLowerCase();

			const model = mongoose.connection.model(modelName);

			// drop if appropriate
			const dropped = await doDrop(
				alreadyDropped,
				lowerCaseModelName,
				config,
				model
			);
			if (dropped) alreadyDropped.set(dropped, true);
			// add
			await model.create(data);
			debug(
				`Added ${data.length} items to %O from %O`,
				pluralize(model.collection.name),
				file
			);
		}

		return;
	} catch (error) {
		return { error };
	}
};

// can't use arrow functions for the constructors
export function CardBuilder(obj) {
	this._id = getObjectId(`${obj.type}:${obj.name.toLowerCase()}`);

	this.name = obj.name;
	this.type = obj.type;
	this[obj.actionName] = obj.actionValue;
	this.duration = obj.duration;
	this.cost = obj.cost;
	this.rarity = obj.rarity;
	this.aoe = obj.aoe;

	const descriptionStart = `${pluralize(obj.name)}`;
	const descriptionEnd = `for ${obj.actionValue} ${pluralize(
		"point",
		obj.actionValue
	)}`;
	const descriptionDuration = obj.duration
		? ` for ${obj.duration} ${pluralize("round", obj.duration)}`
		: "";
	let descriptionMiddle = obj.aoe ? obj.pluralSubject : obj.singularSubject;
	if (descriptionMiddle.length !== 0) {
		descriptionMiddle = ` ${descriptionMiddle} `;
	} else {
		descriptionMiddle = ` ${descriptionMiddle}`;
	}

	this.description =
		obj.description ||
		`${descriptionStart}${descriptionMiddle}${descriptionEnd}${descriptionDuration}`;
}

export function DeckBuilder(obj) {
	this.starter = obj.starter;
	this.cards = [];

	for (const element of obj.cards) {
		this.cards.push(getObjectId(element));
	}
}

export function AbilityBuilder(obj) {
	this._id = getObjectId(`${obj.type}:${obj.name.toLowerCase()}`);

	this.name = obj.name;
	this.type = obj.type;
	this[obj.actionName] = obj.actionValue;
	this.duration = obj.duration;

	const descriptionStart = `${sentenceCase(obj.actionName)}`;
	const descriptionMiddle = ` is ${obj.actionValue} points ${
		obj.type === "buff" ? "higher" : "lower"
	} `;
	const descriptionEnd = `than standard`;
	const descriptionDuration = obj.duration
		? ` for ${obj.duration} ${pluralize("round", obj.duration)}`
		: "";

	this.description =
		obj.description ||
		`${descriptionStart}${descriptionMiddle}${descriptionEnd}${descriptionDuration}`;
}

export function CharacterBuilder(obj) {
	this._id = getObjectId(`${obj.archetype}:${obj.name.toLowerCase()}`);
	this.name = obj.name;
	this.archetype = obj.archetype;
	this.description = obj.description;
	this.health = obj.health;
	this.energy = obj.energy;
	this.abilities = [];

	for (const element of obj.abilities) {
		this.abilities.push(getObjectId(element));
	}
}

export function EnemyBuilder(obj) {
	this._id = getObjectId(`${obj.species}:${obj.name.toLowerCase()}`);
	this.name = obj.name;
	this.species = obj.species;
	this.description = `${sentenceCase(obj.name)} the ${sentenceCase(
		obj.species
	)}`;
	this.health = obj.health;
	this.energy = obj.energy;
	this.rarity = obj.rarity;
	this.abilities = [];

	for (const element of obj.abilities) {
		this.abilities.push(getObjectId(element));
	}
}

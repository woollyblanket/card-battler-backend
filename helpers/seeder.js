import path from "path";
import glob from "glob";
import { dbConnect } from "./db.js";
import pluralize from "pluralize";
import mongoose from "mongoose";
import createDebugMessages from "debug";
import { ObjectId } from "mongodb";
import { createHash } from "crypto";

const debug = createDebugMessages("backend:helpers:seeder");

export const getObjectId = (name) => {
	try {
		if (name === "") throw "Name cannot be empty";

		const hash = createHash("sha1").update(name, "utf8").digest("hex");

		return new ObjectId(hash.substring(0, 24));
	} catch (error) {
		return { error };
	}
};

export const getObjectIds = (names) => {
	return names.map((name) => getObjectId(name));
};

export const seed = async () => {
	try {
		// make sure we're connected to the db
		if (mongoose.connection.readyState === 0) {
			// 0: disconnected
			// 1: connected
			// 2: connecting
			// 3: disconnecting

			await dbConnect();
		}

		if (mongoose.connection.readyState !== 1)
			throw "Couldn't connect to DB";

		let alreadyDropped = new Map();
		const files = glob.sync("./seed-data/**/*.js");

		for (const file of files) {
			const obj = await import(path.resolve(file));
			const { modelName, data } = obj.default;

			const model = mongoose.connection.model(modelName);

			if (!alreadyDropped.get(modelName)) {
				// drop first
				await model.deleteMany();
				debug("Deleted everything from %O", model);
				alreadyDropped.set(modelName, true);
			}
			// add
			await model.create(data);
			debug(`Added ${data.length} items to %O`, model);
		}
	} catch (error) {
		return { error };
	}
};

// can't use arrow function for a constructor
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
	let descriptionMiddle = obj.aoe ? obj.pluralSubject : obj.singularSubject;
	descriptionMiddle.length !== 0
		? (descriptionMiddle = ` ${descriptionMiddle} `)
		: (descriptionMiddle = ` ${descriptionMiddle}`);

	this.description =
		obj.description ||
		`${descriptionStart}${descriptionMiddle}${descriptionEnd}`;
}

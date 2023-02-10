import { gameDataTypes } from "../components/games/model.js";
import { abilityDataTypes } from "../components/abilities/model.js";
import { playerDataTypes } from "../components/players/model.js";
import { characterDataTypes } from "../components/characters/model.js";
import { cardDataTypes } from "../components/cards/model.js";
import { deckDataTypes } from "../components/decks/model.js";
import { enemyDataTypes } from "../components/enemies/model.js";
import _ from "underscore";

export const SCHEMA_DATA_TYPES = {
	game: gameDataTypes,
	player: playerDataTypes,
	card: cardDataTypes,
	character: characterDataTypes,
	deck: deckDataTypes,
	ability: abilityDataTypes,
	enemy: enemyDataTypes,
};

export const SCHEMA_PROPERTIES = {
	game: Object.getOwnPropertyNames(gameDataTypes),
	player: Object.getOwnPropertyNames(playerDataTypes),
	card: Object.getOwnPropertyNames(cardDataTypes),
	character: Object.getOwnPropertyNames(characterDataTypes),
	deck: Object.getOwnPropertyNames(deckDataTypes),
	ability: Object.getOwnPropertyNames(abilityDataTypes),
	enemy: Object.getOwnPropertyNames(enemyDataTypes),
};

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

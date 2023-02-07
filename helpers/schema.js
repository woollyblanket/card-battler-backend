import { gameDataTypes } from "../components/games/model.js";
import { abilityDataTypes } from "../components/abilities/model.js";
import { playerDataTypes } from "../components/players/model.js";
import { characterDataTypes } from "../components/characters/model.js";
import { cardDataTypes } from "../components/cards/model.js";
import { deckDataTypes } from "../components/decks/model.js";

export const SCHEMA_DATA_TYPES = {
	game: gameDataTypes,
	player: playerDataTypes,
	card: cardDataTypes,
	character: characterDataTypes,
	deck: deckDataTypes,
	ability: abilityDataTypes,
};

export const SCHEMA_PROPERTIES = {
	game: Object.getOwnPropertyNames(gameDataTypes),
	player: Object.getOwnPropertyNames(playerDataTypes),
	card: Object.getOwnPropertyNames(cardDataTypes),
	character: Object.getOwnPropertyNames(characterDataTypes),
	deck: Object.getOwnPropertyNames(deckDataTypes),
	ability: Object.getOwnPropertyNames(abilityDataTypes),
};

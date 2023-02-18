// EXTERNAL IMPORTS		///////////////////////////////////////////

// INTERNAL IMPORTS		///////////////////////////////////////////

// PRIVATE 				///////////////////////////////////////////

// PUBLIC 				///////////////////////////////////////////
export const STATUSES = ["new", "active", "archived", "paused"];
export const OPERATIONS_PER_DATA_TYPE = {
	string: ["assign"],
	number: ["add", "subtract", "assign"],
	objectid: ["assign"],
	boolean: ["assign"],
	date: ["assign"],
	array: ["add", "assign", "remove"],
	object: ["assign"],
};
export const RARITIES = [
	"mythic",
	"legendary",
	"epic",
	"rare",
	"uncommon",
	"common",
];
export const RARITY_WEIGHTS = {
	mythic: 1,
	legendary: 2,
	epic: 5,
	rare: 10,
	uncommon: 50,
	common: 100,
};
export const CARD_TYPES = ["attack", "heal", "shield", "buff", "debuff"];
export const ABILITY_TYPES = ["buff", "debuff", "buff-debuff"];
export const ARCHETYPES = [
	"hero",
	"villain",
	"trickster",
	"mentor",
	"guardian",
];
export const SPECIES = [
	"ooze",
	"dragon",
	"phoenix",
	"goblin",
	"elemental",
	"giant",
	"ghost",
	"beast",
];
export const HAND_DEFAULTS = {
	drawCount: 6,
	sizeLimit: 10,
};

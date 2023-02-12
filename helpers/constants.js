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

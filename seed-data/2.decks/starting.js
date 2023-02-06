import { DeckBuilder } from "../../helpers/seeder.js";

const data = {
	starter: true,
	cards: [],
};

export default {
	modelName: "Deck",
	data: [
		new DeckBuilder({
			...data,
			cards: [
				"attack:cut",
				"attack:cut",
				"attack:slice",
				"attack:slice",
				"shield:shield",
				"shield:shield",
				"shield:hide",
				"shield:duck",
				"heal:rest",
				"heal:rest",
				"buff:energy boost",
				"debuff:energy ooze",
			],
		}),
	],
};

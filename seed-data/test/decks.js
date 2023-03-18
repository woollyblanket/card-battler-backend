import { DeckBuilder } from "../../helpers/seeder.js";

const data = {
	starter: true,
	cards: [],
};

// ignore unused exports default
export default {
	modelName: "Deck",
	data: [
		new DeckBuilder({
			...data,
			cards: ["attack:test1", "attack:test2"],
		}),
	],
};

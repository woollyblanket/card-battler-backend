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
			cards: ["attack:test1", "attack:test2"],
		}),
	],
};

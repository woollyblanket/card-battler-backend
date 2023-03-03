import { CharacterBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	archetype: "",
	description: "",
	health: 80,
	energy: 3,
	abilities: [],
};

// ignore unused exports default
export default {
	modelName: "Character",
	data: [
		new CharacterBuilder({
			...data,
			name: "Lana",
			archetype: "hero",
			description: "Lana is strong",
			abilities: ["buff:super strength"],
		}),
		new CharacterBuilder({
			...data,
			name: "Kol",
			archetype: "villain",
			description: "Kol is quick",
			abilities: ["buff:energy burst"],
		}),
	],
};

import { CharacterBuilder } from "../../helpers/seeder.js";
const data = {
	name: "",
	archetype: "",
	description: "",
	health: 80,
	energy: 3,
	abilities: [],
};

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
		new CharacterBuilder({
			...data,
			name: "Fia",
			archetype: "trickster",
			description: "Fia is tough",
			abilities: ["buff:super health"],
		}),
		new CharacterBuilder({
			...data,
			name: "Rane",
			archetype: "mentor",
			description: "Rane is wise",
			abilities: ["buff:intuition"],
		}),
		new CharacterBuilder({
			...data,
			name: "Alden",
			archetype: "guardian",
			description: "Alden endures",
			abilities: ["buff:super endurance"],
		}),
	],
};

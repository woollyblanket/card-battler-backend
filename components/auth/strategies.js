import LocalStrategy from "passport-local";
import { stripPassword } from "../../helpers/model.js";
import { Player } from "../players/model.js";

export const local = new LocalStrategy(async (username, password, done) => {
	try {
		// need to include the password here explicitly because it
		// isn't included automatically in queries
		let player = await Player.findOne(
			{ username: username },
			"+password"
		).exec();
		if (!player) return done(null, false);
		const match = await player.validatePassword(password);
		player = stripPassword(player);

		if (match) {
			done(null, player);
		} else {
			done(null, false);
		}
	} catch (error) {
		return done(error);
	}
});

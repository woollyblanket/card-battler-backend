import passport from "koa-passport";
import LocalStrategy from "passport-local";
import { getByField } from "../../helpers/model";
import { Player } from "../players/model";

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const player = await getByField([Player, "username", username]);
			if (!player) return done(null, false);
			const match = await player.validatePassword(password);

			if (match) {
				done(null, player);
			} else {
				done(null, false);
			}
		} catch (error) {
			return done(error);
		}
	})
);

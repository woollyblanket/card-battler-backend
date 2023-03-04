import passport from "koa-passport";
import { local } from "./strategies.js";
import { Player } from "../players/model.js";

passport.use(local);

passport.serializeUser((player, done) => {
	done(null, player.username);
});

passport.deserializeUser(async (username, done) => {
	try {
		const player = await Player.findOne({ username: username }).exec();
		done(null, player);
	} catch (error) {
		done(error);
	}
});

export { passport };

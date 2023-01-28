import mongoose from "mongoose";
import Debug from "debug";
import * as dotenv from "dotenv";
dotenv.config();

const debug = Debug("backend:helpers:db");

export const dbConnect = async () => {
	try {
		let dbURI;
		switch (process.env.NODE_ENV) {
			case "development":
				dbURI = process.env.MONGODB_URI_DEV;
				break;
			case "production":
				dbURI = process.env.MONGODB_URI_PROD;
				break;
			case "test":
				dbURI = process.env.MONGODB_URI_TEST;
				break;

			default:
				debug("Couldn't get appropriate DB URI");
				break;
		}

		mongoose.set("strictQuery", false);
		await mongoose.connect(dbURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		return mongoose.connection;
	} catch (error) {
		console.log("error :>> ", error);
	}
};

export const dbClose = async () => {
	return await mongoose.disconnect();
};

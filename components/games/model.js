import { gameSchema } from "./schema.js";
import mongoose from "mongoose";

export const Game = mongoose.model("Game", gameSchema);

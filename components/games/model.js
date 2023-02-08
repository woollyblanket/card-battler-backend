import { gameSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

export const Game = mongoose.model("Game", gameSchema);
export const gameDataTypes = getModelDataTypes(Game.schema.obj);

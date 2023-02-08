import { playerSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

export const Player = mongoose.model("Player", playerSchema);
export const playerDataTypes = getModelDataTypes(Player.schema.obj);

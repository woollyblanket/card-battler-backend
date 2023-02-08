import { enemySchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

export const Enemy = mongoose.model("Enemy", enemySchema);
export const enemyDataTypes = getModelDataTypes(Enemy.schema.obj);

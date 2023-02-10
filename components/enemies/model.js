import { enemySchema } from "./schema.js";
import mongoose from "mongoose";

export const Enemy = mongoose.model("Enemy", enemySchema);

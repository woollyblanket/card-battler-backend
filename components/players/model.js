import { playerSchema } from "./schema.js";
import mongoose from "mongoose";

export const Player = mongoose.model("Player", playerSchema);

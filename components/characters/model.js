import { characterSchema } from "./schema.js";
import mongoose from "mongoose";

export const Character = mongoose.model("Character", characterSchema);

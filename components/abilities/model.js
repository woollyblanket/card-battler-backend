import { abilitySchema } from "./schema.js";
import mongoose from "mongoose";

export const Ability = mongoose.model("Ability", abilitySchema);

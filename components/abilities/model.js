import { abilitySchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

export const Ability = mongoose.model("Ability", abilitySchema);
export const abilityDataTypes = getModelDataTypes(Ability.schema.obj);

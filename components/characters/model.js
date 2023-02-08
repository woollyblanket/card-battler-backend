import { characterSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

export const Character = mongoose.model("Character", characterSchema);
export const characterDataTypes = getModelDataTypes(Character.schema.obj);

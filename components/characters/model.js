import { characterSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

const Character = mongoose.model("Character", characterSchema);
export const validAttributes = Object.getOwnPropertyNames(Character.schema.obj);
export const validDataTypes = getModelDataTypes(Character.schema.obj);

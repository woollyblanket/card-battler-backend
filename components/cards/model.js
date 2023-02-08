import { cardSchema } from "./schema.js";
import mongoose from "mongoose";
import { getModelDataTypes } from "../../helpers/model.js";

export const Card = mongoose.model("Card", cardSchema);
export const cardDataTypes = getModelDataTypes(Card.schema.obj);

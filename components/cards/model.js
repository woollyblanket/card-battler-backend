import { cardSchema } from "./schema.js";
import mongoose from "mongoose";

export const Card = mongoose.model("Card", cardSchema);

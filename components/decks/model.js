import { deckSchema } from "./schema.js";
import mongoose from "mongoose";

export const Deck = mongoose.model("Deck", deckSchema);

// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Card } from "./model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:cards:routes");
const router = express.Router();

debug(Card);

// PUBLIC 				///////////////////////////////////////////
export default router;

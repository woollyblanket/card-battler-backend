// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Character } from "./model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:characters:routes");
const router = express.Router();

// PUBLIC 				///////////////////////////////////////////
export default router;

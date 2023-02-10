// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Ability } from "./model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:abilities:routes");
const router = express.Router();

// PUBLIC 				///////////////////////////////////////////
export default router;

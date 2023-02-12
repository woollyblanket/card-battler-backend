// EXTERNAL IMPORTS		///////////////////////////////////////////
import express from "express";
import createDebugMessages from "debug";

// INTERNAL IMPORTS		///////////////////////////////////////////
import { Enemy } from "./model.js";

// PRIVATE 				///////////////////////////////////////////
const debug = createDebugMessages("battler:backend:enemies:routes");
const router = express.Router();

debug(Enemy);

// PUBLIC 				///////////////////////////////////////////
export default router;

import express from "express";
import createDebugMessages from "debug";
// needs to be imported into a file that's used
import { Ability } from "./model.js";

const debug = createDebugMessages("battler:backend:abilities:routes");
const router = express.Router();

export default router;

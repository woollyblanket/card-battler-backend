import express from "express";
import createDebugMessages from "debug";

const debug = createDebugMessages("battler:backend:enemies:routes");
const router = express.Router();

export default router;

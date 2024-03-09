import express from "express";
import command from "./command.js";

const router = express.Router();

router.use("/command", command);

export default router;

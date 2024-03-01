import express from "express";
import command from "./command";

const router = express.Router();

router.use("/command", command);

export default router;
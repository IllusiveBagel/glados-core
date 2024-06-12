import express from "express";
import multer from "multer";
import controller from "../controllers/command.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audioData"), controller.processCommand);
router.post("/text", upload.single("audioData"), controller.processTextCommand);

export default router;

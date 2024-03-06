import { Request, Response, NextFunction } from "express";
import axios from "axios";
import openai from "../modules/openai";

const processCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.TTS_URL || process.env.TTS_URL.trim() === "") {
    throw new Error("TTS_URL environment variable is not set or is empty");
  }

  const sendCommand = await openai.processCommand(
    req.body.command.toLowerCase()
  );

  const response = await axios.get(
    process.env.TTS_URL + sendCommand?.[0]?.message?.content,
    {
      responseType: "stream",
    }
  );
  res.setHeader("Content-Type", "audio/wav");
  response.data.pipe(res);
};

export default { processCommand };

import { Request, Response, NextFunction } from "express";
import axios from "axios";
import openai from "../modules/openai.js";
import speechtotext from "../modules/speechtotext.js";

const processCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.TTS_URL || process.env.TTS_URL.trim() === "") {
    throw new Error("TTS_URL environment variable is not set or is empty");
  }

  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  try {
    const result = await speechtotext.recognise(req.file.buffer);

    const sendCommand = await openai.processCommand(result);
    const response = await axios.get(
      process.env.TTS_URL + sendCommand?.[0]?.message?.content,
      {
        responseType: "stream",
      }
    );
    res.setHeader("Content-Type", "audio/wav");
    response.data.pipe(res);
  } catch (error) {
    res
      .status(500)
      .send(JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
};

const processTextCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  try {
    const result = await speechtotext.recognise(req.file.buffer);

    const sendCommand = await openai.processCommand(result);

    const responseData = { message: sendCommand?.[0]?.message?.content };

    res.setHeader("Content-Type", "application/json");
    res.send(responseData);
  } catch (error) {
    res
      .status(500)
      .send(JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
};

export default { processCommand, processTextCommand };

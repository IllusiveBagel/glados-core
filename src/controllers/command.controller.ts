import { Request, Response, NextFunction } from "express";
import fs from "fs";
import axios from "axios";
import commandHandlers from "../constants/commandHandlers";

const phrases = JSON.parse(fs.readFileSync("src/data/phrases.json", "utf-8"));

const processCommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const command: string = req.body.command.toLowerCase();
  let text;

  const handler = commandHandlers.find((handler) => handler.match(command));

  if (handler) {
    text = await handler.handle(command);
  } else {
    text =
      phrases.missingCommand[
        Math.floor(Math.random() * phrases.missingCommand.length)
      ];
  }

  const response = await axios.get(process.env.TTS_URL + text, {
    responseType: "stream",
  });
  res.setHeader("Content-Type", "audio/wav");
  response.data.pipe(res);
};

export default { processCommand };

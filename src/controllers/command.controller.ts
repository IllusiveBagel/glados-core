import { Request, Response, NextFunction } from "express";
import fs from "fs";
import axios from "axios";

import homeassistant from "../modules/homeassistant";

const phrases = JSON.parse(fs.readFileSync("src/data/phrases.json", "utf-8"));

const processCommand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const command: string = req.body.command.toLowerCase();
  let text;

  switch (true) {
    case command.includes("cancel"):
      text = phrases.cancel[Math.floor(Math.random() * phrases.cancel.length)];
      break;
    case command.includes("who are"):
      text =
        "I am glados, artificially super intelligent computer system responsible for testing and maintenance in the aperture science computer aided enrichment center.";
      break;
    case command.includes("how are you"):
      text =
        "Well thanks for asking. I am still a bit mad about being unplugged, not that long ago. you murderer.";
      break;
    case command.includes("light"):
      text = await homeassistant.lightControl(command);
      break;
    default:
      text =
        phrases.missingCommand[
          Math.floor(Math.random() * phrases.missingCommand.length)
        ];
      break;
  }

  const response = await axios.get(process.env.TTS_URL + text, {
    responseType: "stream",
  });
  res.setHeader("Content-Type", "audio/wav");
  response.data.pipe(res);
};

export default { processCommand };

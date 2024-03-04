import fs from "fs";
import homeassistant from "../modules/homeassistant";

const phrases = JSON.parse(fs.readFileSync("src/data/phrases.json", "utf-8"));

const commandHandlers = [
  {
    match: (command: string) => command.includes("cancel"),
    handle: () =>
      phrases.cancel[Math.floor(Math.random() * phrases.cancel.length)],
  },
  {
    match: (command: string) => command.includes("who are"),
    handle: () =>
      "I am glados, artificially super intelligent computer system responsible for testing and maintenance in the aperture science computer aided enrichment center.",
  },
  {
    match: (command: string) => command.includes("how are you"),
    handle: () =>
      "Well thanks for asking. I am still a bit mad about being unplugged, not that long ago. you murderer.",
  },
  {
    match: (command: string) => command.includes("light"),
    handle: async (command: string) =>
      await homeassistant.lightControl(command),
  },
];

export default commandHandlers;

import fs from "fs";
import axios from "axios";

const phrases = JSON.parse(fs.readFileSync("src/data/phrases.json", "utf-8"));

const lightControl = async (command: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.HOMEASSISTANT_TOKEN}`,
  };
  const intent: string | null = matchOnOff(command);
  const room: string = extractRoom(command);
  const brightness: number | null = extractBrightness(command);
  let url: string = "";
  let body: any;

  if (intent) {
    url = `${process.env.HOMEASSISTANT_URL}services/light/turn_${intent}`;
    body = {
      entity_id: `light.${room}`,
    };
  }

  if (brightness) {
    url = `${process.env.HOMEASSISTANT_URL}services/light/turn_on`;
    body = {
      entity_id: `light.${room}`,
      brightness,
    };
  }

  try {
    const response = await axios.post(url, body, { headers });
    if (response.status === 200) {
      if (intent === "on") {
        return phrases.lightOn[
          Math.floor(Math.random() * phrases.lightOn.length)
        ];
      } else if (intent === "off") {
        return phrases.lightOff[
          Math.floor(Math.random() * phrases.lightOff.length)
        ];
      } else {
        return phrases.lightBrightness[
          Math.floor(Math.random() * phrases.lightBrightness.length)
        ];
      }
    } else {
      return phrases.failure[
        Math.floor(Math.random() * phrases.failure.length)
      ];
    }
  } catch (error: any) {
    switch (error.response.status) {
      case 401:
        console.log(
          "\x1b[31mERROR:\x1b[0m Home Assistant rejected access token."
        );
        return "It looks like my home automation core has rejected my crentials.";
      case 404:
        console.log("\x1b[31mERROR:\x1b[0m Home Assistant URL not found.");
        return "My home automation core has no idea what you just requested it.";
      case 500:
        console.log(
          "\x1b[31mERROR:\x1b[0m Home Assistant internal server error."
        );
        return "My home automation core encountered an internal server error.";
    }
  }
};

const matchOnOff = (command: string) => {
  if (command.includes("on")) {
    return "on";
  } else if (command.includes("off")) {
    return "off";
  } else {
    return null;
  }
};

const extractRoom = (command: string): string => {
  const rooms = ["kitchen", "living room", "bedroom"];
  const matchedRooms = rooms.filter((room) => command.includes(room));
  return matchedRooms[0];
};

const extractBrightness = (command: string): number | null => {
  const brightnessRegex = /(\d+)%/;
  const match = command.match(brightnessRegex);
  if (match) {
    const percentage = parseInt(match[1]);
    const brightness = Math.round((percentage / 100) * 255);
    return brightness;
  } else {
    return null;
  }
};

export default {
  lightControl,
};

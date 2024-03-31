import OpenAI from "openai";
import homeassistant from "../modules/homeassistant.js";

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "change_light_state",
      description: "Turn a light on or off in a given room",
      parameters: {
        type: "object",
        properties: {
          room: {
            type: "string",
            description:
              "The room in which the light is located e.g Kitchen or Bedroom",
          },
          state: { type: "string", enum: ["on", "off"] },
        },
        required: ["room", "state"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get the current weather from home assistant",
      parameters: {
        type: "object",
      },
    },
  },
];

const availableFunctions = {
  change_light_state: homeassistant.changeLightState,
  get_weather: homeassistant.getWeather,
};

export default {
  tools,
  availableFunctions,
};

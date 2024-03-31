import OpenAI from "openai";
import homeassistant from "./homeassistant.js";
import prompts from "../constants/prompts.js";
import OpenAITools from "../constants/OpenAITools.js";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const processCommand = async (command: string) => {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: prompts.gladosPrompt,
    },
    {
      role: "user",
      content: command,
    },
  ];

  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-0125",
      messages: messages,
      tools: OpenAITools.tools,
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });

  let responseMessage;
  if (response && response.choices) {
    responseMessage = response.choices[0].message;
  } else {
    // Handle the case when response is void or choices property does not exist
    // For example, you can throw an error or return an empty responseMessage
    throw new Error("Invalid response from OpenAI");
  }

  const toolCalls = responseMessage.tool_calls;

  if (responseMessage.tool_calls) {
    messages.push({
      role: "assistant",
      content: responseMessage.content || "",
    });

    for (const toolCall of toolCalls ?? []) {
      const functionName = toolCall.function.name;
      const functionToCall =
        OpenAITools.availableFunctions[
          functionName as keyof typeof OpenAITools.availableFunctions
        ];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      console.log(`Calling function ${functionName} with args:`, functionArgs);
      const functionResponse = await functionToCall(functionArgs);

      messages.push({
        tool_call_id: toolCall.id,
        role: "assistant",
        name: functionName,
        content: functionResponse,
      } as OpenAI.ChatCompletionMessageParam);
    }

    const secondResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: messages as OpenAI.ChatCompletionMessageParam[],
    });

    return secondResponse.choices;
  } else {
    return response.choices;
  }
};

export default { processCommand };

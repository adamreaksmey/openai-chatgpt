import OpenAI from "openai";
import dotenv from "dotenv";
import { askRLineQuestion } from "./functions/ask";
import { quizJson } from "./quiz/index";

dotenv.config();
const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });

const main = async () => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions:
        "You are a personal math tutor. Answer questions briefly, in a sentence or less.",
      tools: [
        { type: "code_interpreter" },
        {
          type: "function",
          function: quizJson,
        },
      ],
      // will work much better with the new model
      model: "gpt-4-1106-preview",
      // model: "gpt-3.5-turbo-1106",
    });

    console.log("Log on no errors.");
    const thread = await openai.beta.threads.create();

    console.log("First log");
  } catch (error) {
    console.log(error);
  }
};

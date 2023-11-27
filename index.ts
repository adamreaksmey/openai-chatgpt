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

    // threads created
    const thread = await openai.beta.threads.create();
    // Use continueConversation as state for keep asking questions
    let continueConversation = true;
    let isQuizAnswered = false;

    while (continueConversation) {
      const userQuestion = isQuizAnswered
        ? await askRLineQuestion("You next question to the model: \n")
        : // this will make the model  build a quiz using our provided function
          "Make a quiz with 2 questions: One open ended, one multiple choice" +
          "Then, give me feedback for the responses.";

      // Pass in the user question into the existing thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: userQuestion,
      });
    }

    // Use runs to wait for the assistant response and then retrieve it
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let actualRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Polling mechanism to see if actualRun is completed
    while (
      actualRun.status === "queued" ||
      actualRun.status === "in_progress" ||
      actualRun.status === "requires_action"
    ) {
      if (actualRun.status === "requires_action") {
        // extra single tool call
        const toolCall =
          actualRun.required_action?.submit_tool_outputs?.tool_calls[0];

        const name = toolCall?.function.name;

        const args = JSON.parse(toolCall?.function?.arguments || "{}");
        const questions = args.questions;

        const responses = await displayQuiz(name || "cool quiz", questions);

        // toggle flag that sets initial quiz
        isQuizAnswered = true;
        
      }
    }
  } catch (error) {
    console.log(error);
  }
};

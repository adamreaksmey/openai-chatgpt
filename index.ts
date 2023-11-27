import OpenAI from "openai";
import dotenv from "dotenv";
import { askRLineQuestion } from "./functions/ask";
import { quizJson } from "./quiz/index";
import { displayQuiz } from "./functions/displayQuiz";
import { statusRun } from "./functions/statusRun";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
    const params = {
      actualRun,
      askRLineQuestion,
      isQuizAnswered,
      openai,
      thread,
      run,
      displayQuiz,
    };
    await statusRun(params);

    // Get the last assistant message from the messages array
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === run.id && message.role === "assistant"
      )
      .pop();

    // If an assistant message is found, console.log() it
    if (lastMessageForRun) {
      // aparently the `content` array is not correctly typed
      // content returns an of objects do contain a text object
      const messageValue = lastMessageForRun.content[0] as {
        text: { value: string };
      };

      console.log(`${messageValue?.text?.value} \n`);
    }

    // Then ask if the user wants to ask another question and update continueConversation state
    const continueAsking = await askRLineQuestion(
      "Do you want to keep having a conversation? (yes/no) "
    );

    continueConversation = continueAsking.toLowerCase().includes("yes");

    // If the continueConversation state is falsy show an ending message
    if (!continueConversation) {
      console.log("Alrighty then, I hope you learned something!\n");
    }

    // close the readline
    readline.close();
  } catch (error) {
    console.log(error);
  }
};

import Sitemapper from "sitemapper";
import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import dotenv from 'dotenv';
import { ReadLine } from "readline";

dotenv.config();

const apiKey = process.env.OPEN_AI_KEY;

const openai = new OpenAI({ apiKey: apiKey });

async function main(): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
  return completion;
}
main();

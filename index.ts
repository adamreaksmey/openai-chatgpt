import Sitemapper from "sitemapper";
import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPEN_AI_KEY;

const openai = new OpenAI({ apiKey: apiKey });

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();

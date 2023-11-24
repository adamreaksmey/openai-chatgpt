import Sitemapper from "sitemapper";
import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({
  apiKey: apiKey,
});

// console.log("hello world");
// console.log(process.env.OPEN_AI_KEY);

const fullWebsiteAssistant = async (url: string): Promise<Assistant> => {
  const sitemap = new Sitemapper({ url });
  const { sites } = await sitemap.fetch();

  const files: any = await Promise.all(
    sites.map(async (site) => {
      const fileResult = await openai.files.create({
        file: await fetch(site),
        purpose: "assistants",
      });

      return fileResult;
    })
  );

  const openaiResult = await openai.beta.assistants.create({
    instructions: "You are adam's assistant.",
    model: "gpt-4-1106-preview",
    tools: [{ type: "retrieval" }],
    file_ids: files.map((file: any) => file.id),
  });

  return openaiResult;
};

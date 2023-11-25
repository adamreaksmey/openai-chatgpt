import OpenAI from "openai";
import dotenv from "dotenv";
import { askRLineQuestion } from "./functions/ask"
import { quizJson } from "./quiz/index"

dotenv.config();
const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });
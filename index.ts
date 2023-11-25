import OpenAI from "openai";
import dotenv from "dotenv";
import {askRLineQuestion } from "./functions/ask"

dotenv.config();
const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });
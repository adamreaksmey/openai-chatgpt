import Sitemapper from "sitemapper";
import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import dotenv from 'dotenv';
import { ReadLine } from "readline";

dotenv.config();

const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });

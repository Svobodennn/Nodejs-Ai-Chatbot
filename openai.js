import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const list = await openai.models.list();

  for await (const model of list) {
    console.log(model);
  }
}
main();
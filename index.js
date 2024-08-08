/*
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
           model: 'gpt-3.5-turbo',

           messages: [{ role: 'user', content: 'Say this is a test' }],
   });

  console.log(chatCompletion);
}
*/


import OpenAI from "openai";
import dotenv from 'dotenv';
import readlineSync from 'readline-sync';
import colors from 'colors';
dotenv.config();


async function main() {
    console.log(colors.bold.green('Welcome to the Chatbot Program\n'));
    console.log(colors.bold.green('You can start chatting with the bot\n'));
    const userName = readlineSync.question('May I have your name?');

    const chatHistory =  [];

    while(true){
        const userInput = readlineSync.question(colors.yellow('You: '));
        try {
        
            if(userInput.toLowerCase() === 'exit')
                return;

            // construct messages by iterating over the history
            const messages = chatHistory.map(([role, content]) => ({ role, content}));
            // add latest user input
            messages.push({role: 'user', content: userInput});

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
    
            if (!process.env.OPENAI_API_KEY) {
                throw new Error("The OPENAI_API_KEY environment variable is missing or empty. Please provide it.");
            }
    
            const stream = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
                stream: true,
            });
    
            for await (const chunk of stream) {
                const response = (chunk.choices[0]?.message.content || "");
                chatHistory.push(['user', userInput])
                chatHistory.push(['assistant', response])
                console.log(colors.green('Bot: ') + response);
            }
        } catch (error) {
            console.error(colors.red(error.message));
            return;
        }
    }
    
}

main();

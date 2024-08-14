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

    const chatHistory = [];

    while (true) {
        const userInput = readlineSync.question(colors.yellow('You: '));
        try {
            if (userInput.toLowerCase() === 'exit') return;

            // Construct messages by iterating over the history
            const messages = chatHistory.map(([role, content]) => ({ role, content }));
            // Add latest user input
            messages.push({ role: 'user', content: userInput });

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            if (!process.env.OPENAI_API_KEY) {
                throw new Error("The OPENAI_API_KEY environment variable is missing or empty. Please provide it.");
            }

            const stream = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
                stream: true,
            });

            let botResponse = ''; // Initialize a variable to accumulate the response

            process.stdout.write(colors.green('Bot: ')); // Print the bot prefix only once

            for await (const chunk of stream) {
                const responsePart = chunk.choices[0]?.delta?.content || "";
                botResponse += responsePart; // Accumulate response parts
                process.stdout.write(responsePart); // Print the current chunk without prefix
            }

            console.log(); // Move to the next line after the complete response

            // Update chat history with both the user's input and the bot's response
            chatHistory.push(['user', userInput]);
            chatHistory.push(['assistant', botResponse]);

        } catch (error) {
            console.error(colors.red(error.message));
            return;
        }
    }
}

main();

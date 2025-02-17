require("dotenv").config();
import Anthropic from '@anthropic-ai/sdk';
import { BASE_PROMPT, getSystemPrompt } from './prompts';
import express from "express";
import { ContentBlock, TextBlock } from '@anthropic-ai/sdk/resources';
import { basePrompt as reactBasePrompt } from './defaults/react';
import { basePrompt as nodeBasePrompt } from './defaults/node';
import cors from 'cors';

const anthropic = new Anthropic();

const app = express();
app.use(express.json()); 
app.use(cors());

app.post('/template', async (req, res)=>{
    const prompt = req.body.prompt;

    const response = await anthropic.messages.create({
        messages: [{
            role: 'user', content: prompt
        }],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra."
    });

    const answer = (response.content[0] as TextBlock).text;  //returns either node or react
    // console.log(answer);
    
    if(answer == 'react'){
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all the files of the project visible to you.\nConsider the content of All files in the project.\n\n${reactBasePrompt} \n\nHere is a list of files that exist on the file system but are not shown to you:\n\n - .gitignore\n\n - package-lock.json`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if(answer == 'node'){
        res.json({
            prompts: [`Here is an artifact that contains all the files of the project visible to you.\nConsider the content of All files in the project.\n\n${reactBasePrompt} \n\nHere is a list of files that exist on the file system but are not shown to you:\n\n - .gitignore\n\n - package-lock.json`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({message: "Only react and Node is available right now!!! Stay tuned for various different techStacks"});
    return;
})

async function main() {
    anthropic.messages.stream({
        messages: [{
            role: 'user', content: "Hello"
        }, {
            role: 'user', content: "Here is an artifact that contains all the files of the project visible to you.\nConsider the content of All files in the project.\n\n{{BASE_PROMPT}} \n\n"
        }, {
            role: 'user',
            content: "Create a todo app"
        }
    ],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: getSystemPrompt()
    }).on('text', (text) => {
        console.log(text);
    });
};

app.post('/chat', async (req, res)=>{
    const messages = req.body.messages;
    const response = await anthropic.messages.create({
        messages: messages,
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 8000,
        system: getSystemPrompt()
    });
    
    res.json({
        response: (response.content[0] as TextBlock)?.text
    })
})


//for streaming web socket is needed here
// app.post('/chat', async (req, res) => {
//     const messages = req.body.messages;

//     // Set appropriate headers to enable streaming
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Transfer-Encoding', 'chunked');

//     try {
//         // Stream the response from the anthropic API
//         const response = anthropic.messages.stream({
//             messages: messages,
//             model: 'claude-3-5-haiku-20241022',
//             max_tokens: 8000,
//             system: getSystemPrompt()
//         });

//         // Listen for "text" events and stream chunks to the client
//         response.on('text', (text) => {
//             console.log(text);
//             res.write(JSON.stringify({ text }) + '\n'); // Stream each chunk
//         });

//         // End the response when the stream finishes
//         response.on('end', () => {
//             res.end(); // Finalize the response
//         });

//         // Handle errors
//         response.on('error', (err) => {
//             console.error(err);
//             res.status(500).send({ error: 'Stream failed' });
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// });

app.listen(3000, ()=>{
    console.log("Server currently running at 3000");
});

//main();
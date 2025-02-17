"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const prompts_1 = require("./prompts");
const express_1 = __importDefault(require("express"));
const react_1 = require("./defaults/react");
const node_1 = require("./defaults/node");
const cors_1 = __importDefault(require("cors"));
const anthropic = new sdk_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield anthropic.messages.create({
        messages: [{
                role: 'user', content: prompt
            }],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra."
    });
    const answer = response.content[0].text; //returns either node or react
    // console.log(answer);
    if (answer == 'react') {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all the files of the project visible to you.\nConsider the content of All files in the project.\n\n${react_1.basePrompt} \n\nHere is a list of files that exist on the file system but are not shown to you:\n\n - .gitignore\n\n - package-lock.json`],
            uiPrompts: [react_1.basePrompt]
        });
        return;
    }
    if (answer == 'node') {
        res.json({
            prompts: [`Here is an artifact that contains all the files of the project visible to you.\nConsider the content of All files in the project.\n\n${react_1.basePrompt} \n\nHere is a list of files that exist on the file system but are not shown to you:\n\n - .gitignore\n\n - package-lock.json`],
            uiPrompts: [node_1.basePrompt]
        });
        return;
    }
    res.status(403).json({ message: "Only react and Node is available right now!!! Stay tuned for various different techStacks" });
    return;
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
            system: (0, prompts_1.getSystemPrompt)()
        }).on('text', (text) => {
            console.log(text);
        });
    });
}
;
app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const messages = req.body.messages;
    const response = yield anthropic.messages.create({
        messages: messages,
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 8000,
        system: (0, prompts_1.getSystemPrompt)()
    });
    res.json({
        response: (_a = response.content[0]) === null || _a === void 0 ? void 0 : _a.text
    });
}));
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
app.listen(3000, () => {
    console.log("Server currently running at 3000");
});
//main();

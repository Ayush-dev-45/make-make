require("dotenv").config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

const response = async () => {
    const stream = await client.messages.stream({
        messages: [{ role: 'user', content: "Hello tell me about webrctc" }],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
    });

    stream.on('text', (text) => {
        console.log(text);
    });
};

response();
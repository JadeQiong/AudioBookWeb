// openaiClient.js
const { OpenAI } = require('openai');

function getOpenAIClient() {


  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
    });
}

module.exports = getOpenAIClient;

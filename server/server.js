// Express

// Communicatie met ChatGPT via Azure API

import { ChatOpenAI } from "@langchain/openai"

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

const joke = await model.invoke("Tell me a Javascript joke!")
console.log(joke.content)
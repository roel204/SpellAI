import express from "express";
import {ChatOpenAI} from "@langchain/openai";

const router = express.Router();
router.use(express.urlencoded({extended: true}));

// Middleware to enable CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    next();
});

// Middleware to check the Content-Type header for all POST requests
const checkContentTypeHeader = (req, res, next) => {
    if (req.method === 'POST' && (!req.headers['content-type'] ||
        !['application/json', 'application/x-www-form-urlencoded'].includes(req.headers['content-type']))) {
        // Respond with 415 Unsupported Media Type if the Content-Type header is missing or not allowed
        return res.status(415).json({error: "Only application/json and application/x-www-form-urlencoded are allowed in the Content-Type header for POST requests"});
    }
    // Continue processing the request if the Content-Type header is correct or for non-POST requests
    next();
};

router.use(checkContentTypeHeader);

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

router.post("/", async (req, res) => {
    console.log("Start /Post")
    const {query} = req.body;

    try {
        const chat = await model.invoke(query);

        res.json(chat.content);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.options("/", (req, res) => {
    console.log("Start /Options")
    res.header("Allow", "POST, OPTIONS");
    res.status(200).send();
});

export default router;
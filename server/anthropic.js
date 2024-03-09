import express from "express";
import { ChatAnthropic } from "@langchain/anthropic";

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
router.use((req, res, next) => {
    if (req.method === 'POST' && (!req.headers['content-type'] || !['application/json'].includes(req.headers['content-type']))) {
        return res.status(415).json({error: "Only application/json is allowed in the Content-Type header for POST requests"});
    }
    next();
});

// Create Anthropic model
const model = new ChatAnthropic({
    temperature: 0.0,
    maxTokens: 500,
    modelName: "claude-3-sonnet-20240229",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
});

// Catch POST request and answer with a response
router.post("/", async (req, res) => {
    const {query} = req.body;

    try {
        const chat = await model.invoke(query);
        res.json(chat.content);

    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Options Route
router.options("/", (req, res) => {
    res.header("Allow", "POST, OPTIONS");
    res.status(200).send();
});

export default router;
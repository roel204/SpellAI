import express from "express";
import {ChatOpenAI} from "@langchain/openai";

const router = express.Router();
router.use(express.urlencoded({extended: true}));

// Middleware to enable CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    next();
});

// Middleware to check the Accept header for all GET requests
const checkAcceptHeader = (req, res, next) => {
    if (req.method === 'GET' && (!req.headers.accept || req.headers.accept !== 'application/json')) {
        // Respond with 406 Not Acceptable if the Accept header is missing or not application/json
        return res.status(406).json({error: "Only application/json is allowed in the Accept header for GET requests"});
    }
    // Continue processing the request if the Accept header is correct or for non-GET requests
    next();
};

router.use(checkAcceptHeader);

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

router.get("/", async (req, res) => {
    console.log("Start /Get")
    try {
        const joke = await model.invoke("Tell me a Javascript joke!");

        res.json(joke.content);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    console.log("Complete Get")
});

router.options("/", (req, res) => {
    console.log("Start /Options")
    res.header("Allow", "GET, OPTIONS");
    res.status(200).send();
});

export default router;
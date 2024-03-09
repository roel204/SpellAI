import express from 'express';
import openAI from './openAI.js'
import anthropic from "./anthropic.js";

const app = express();

app.use(express.json());
app.use("/anthropic", anthropic);
app.use("/openAI", openAI)

// Catch-all route for undefined routes
app.use((req, res) => {
    console.log("Fallback activated")
    res.status(404).json({ error: "Not Found" });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
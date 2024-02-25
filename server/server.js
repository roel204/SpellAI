import express from 'express';
import jokeRouter from './joke.js'
import chatRouter from './chat.js'

const app = express();

app.use(express.json());
app.use("/joke", jokeRouter);
app.use("/chat", chatRouter);

// Catch-all route for undefined routes
app.use((req, res) => {
    console.log("Fallback activated")
    res.status(404).json({ error: "Not Found" });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
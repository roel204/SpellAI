# SpellAI

**SpellAI** is an AI-powered application that helps you improve your writing by checking grammar and spelling in your text.


## Installation instructions:

- Make sure you have Node.js installed on your system.

### Setting up the server locally:

1. Download and open this project in your preferred IDE.
2. Navigate to the `server` folder.
3. Run: `npm install` to install project dependencies.
4. Copy the `.env.example` file and rename it to `.env`.
5. Fill the `.env` file with your your key and other info.
6. Run: `npm run dev` to start the server.


### Opening the website:

Once the server is running, you can access the SpellAI application by visiting: https://roel204.github.io/SpellAI/

## Known Issues:

- Sometimes the local server will crash when launching, simply run the command again.
- The ChatLLM can give different answers with the same input, even with temperature on 0. This makes it hard to create a working prompt. 
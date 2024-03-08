const form = document.getElementById("TextForm");
const inputField = document.getElementById("input");
const instructionField = document.getElementById("instruction");
const instructionHistoryElement = document.getElementById("instructionHistoryElement");
const submitButton = document.getElementById("submitButton");
const loader = document.getElementById("loader");
loader.classList.add("dn");
const responseField = document.getElementById("response");
const clearButton = document.getElementById("clearButton");
let dateTime = ""
let instructionHistory = [];
let history = [];

async function getDateTime() {
    try {
        const response = await fetch("https://worldtimeapi.org/api/ip", {
            method: "GET",
        });

        if (!response.ok) {
            new Error("Failed to get time");
        } else {
            const data = await response.json();
            dateTime = data.datetime
        }

    } catch (error) {
        console.log(error)
    }
}
getDateTime().then(r => loadHistory())

function loadHistory() {
    let storedHistory = localStorage.getItem("spellAIHistory");

    // If there is any stored history, fill the array and show the latest text and response. Else, add the system message to the start.
    if (storedHistory) {
        history = JSON.parse(storedHistory);
        const latestText = history[history.length - 3][1].slice(9);
        const latestResponse = history[history.length - 1][1];
        inputField.value = latestText
        responseField.innerHTML = latestResponse
    } else {
        storedHistory = JSON.stringify([
            ["system", `You are a language critic. A human has written a text. There are also instructions from the human.
Please ensure the text is grammatically correct. Respond with the improved text in HTML format, start with the p tag.
Any changes made from the original text should be wrapped in your response text with a span tag with the class "changes". Don't place a list at the end, respond only with the changed text, wrap any changes you made with a span tag with the class "changes". This will indicate to the user what has been modified from their original text.
An example, you can change the text: "helo there, im Susan" to the text with html tags: "<p><span class="changes">Hello</span> there, <span class="changes">I'm</span> Susan<span class="changes">.</span></p>"
Also add the date "${dateTime}" at the end in the format "Date: Day - Month - Year"`],
        ]);
        history = JSON.parse(storedHistory);
        console.log(dateTime)
    }

    // Load the instructions and show them on the page
    const storedInstructions = localStorage.getItem("spellAIInstructions");
    if (storedInstructions) {
        instructionHistory = JSON.parse(storedInstructions);
        instructionHistoryElement.innerHTML = "";
        instructionHistory.forEach(instruction => {
            const listItem = document.createElement("li");
            listItem.textContent = instruction;
            instructionHistoryElement.appendChild(listItem);
        });
    }
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get text from the form
    const formData = new FormData(this);
    const inputText = formData.get("input");
    let instruction = formData.get("instruction");
    instruction = instruction ? `${instruction}` : `Focus on my grammar and sentence structure.`

    // Disable the form when text has been submitted
    form.disabled = true;
    inputField.disabled = true;
    instructionField.disabled = true;
    submitButton.disabled = true;
    loader.classList.remove("dn")

    // Add the human text & instruction to the history array
    history.push(
        ["human", `My text: ${inputText}`],
        ["human", `My instructions: ${instruction}`]
    )
    console.log(history)

    // Add instruction to it's own history to display on the website
    instructionHistory.push(instruction)
    const listItem = document.createElement("li");
    listItem.textContent = `${instruction}`;
    instructionHistoryElement.appendChild(listItem);


//     const engineeredPrompt = `
// You are a language critic. Someone has written the following text: ${inputText}
// ${instruction ? `They have also provided the following instructions: ${instruction}` : ''}
// Please ensure it is grammatically correct. Respond with the improved text in HTML format, start with the p tag.
// Any changes made from the original text should be wrapped in a span tag with the class "changes". This will indicate to the user what has been modified from their original text.`;

    try {
        // Send POST request to the server with the input
        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query: history})
        });

        if (!response.ok) {
            new Error("Failed to submit");
            alert("Failed to submit")
        }

        // Wait for response and show
        const responseJSON = await response.json();
        responseField.innerHTML = responseJSON

        // Add AI response to the history array
        history.push(
            ["ai", `${responseJSON}`]
        )

        // Save history into localstorage
        localStorage.setItem("spellAIHistory", JSON.stringify(history));
        localStorage.setItem("spellAIInstructions", JSON.stringify(instructionHistory));

    } catch (error) {
        console.error("Error:", error);
        alert("An error has occurred, make sure you have the server side running locally. Read: https://github.com/roel204/SpellAI/blob/master/README.md")
    }

    // Enable form again
    finally {
        form.disabled = false;
        inputField.disabled = false;
        instructionField.disabled = false;
        submitButton.disabled = false;
        loader.classList.add("dn")
    }
});

clearButton.addEventListener("click", function () {
    localStorage.clear();
    window.location.reload();
});

// SpeechRecognition code.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const talkButton = document.getElementById("talkButton")
talkButton.addEventListener('click', () => startListening())

async function startListening() {
    // Make .disabled work without a button
    if (!talkButton.disabled) {
        talkButton.classList.add("redMic")
        talkButton.disabled = true

        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const recognition = new SpeechRecognition()
            recognition.lang = 'en-US'
            //recognition.lang = 'nl-NL'
            recognition.interimResults = false
            recognition.maxAlternatives = 1
            recognition.start(stream)

            recognition.addEventListener("result", (event) => checkResult(event))

            recognition.onspeechend = function () {
                recognition.stop()
                talkButton.disabled = false
                talkButton.classList.remove("redMic")
            }

            recognition.onerror = function (event) {
                recognition.stop()
                talkButton.disabled = false
                talkButton.classList.remove("redMic")
                console.log(event.error)
            }
        } catch (error) {
            console.error("Error accessing microphone:", error);
            talkButton.disabled = false;
            talkButton.classList.remove("redMic")
        }
    }
}

function checkResult(event) {
    let speechResult = event.results[0][0].transcript
    console.log(speechResult)
    console.log('Confidence: ' + event.results[0][0].confidence)
    inputField.value = inputField.value + speechResult
}
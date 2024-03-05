const form = document.getElementById("TextForm");
const inputField = document.getElementById("input")
const instructionField = document.getElementById("instruction")
const instructionHistoryElement = document.getElementById("instructionHistoryElement")
const submitButton = document.getElementById("submitButton");
const loader = document.getElementById("loader")
const responseField = document.getElementById("response")
loader.classList.add("dn")
let instructionHistory = [];
let history = [
    ["system", `You are a language critic. A human has written a text. There are also instructions from the human.
Please ensure the text is grammatically correct. Respond with the improved text in HTML format, start with the p tag.
Any changes made from the original text should be wrapped in your response text with a span tag with the class "changes". Don't place a list at the end, respond only with the changed text, wrap any changes you made with a span tag with the class "changes". This will indicate to the user what has been modified from their original text.
An example, you can change the text: "helo there, im Susan." to the text with html tags: "<p><span class="changes">Hello</span> there, <span class="changes">I'm</span> Susan.</p>"`],
];

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get text from the form
    const formData = new FormData(this);
    const inputText = formData.get("input");
    const instruction = formData.get("instruction");

    // Disable the form when text has been submitted
    form.disabled = true;
    inputField.disabled = true;
    instructionField.disabled = true;
    submitButton.disabled = true;
    loader.classList.remove("dn")

    // Add the human text & instruction to the history array
    history.push(
        ["human", `My text: ${inputText}`],
        ["human", `My instructions: ${instruction ? `${instruction}` : `Focus on my grammar and sentence structure.`}`]
    )
    console.log(history)
    
    // Add instruction to it's own history to display on the website
    instructionHistory.push(instruction)
    const listItem = document.createElement("li");
    listItem.textContent = `${instruction ? `${instruction}` : `Focus on my grammar and sentence structure.`}`;
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
            new Error("Failed to submit question");
        }

        // Wait for response and show
        const responseJSON = await response.json();
        responseField.innerHTML = responseJSON
        
        // Add AI response to the history array
        history.push(
            ["ai", `${responseJSON}`]
        )
        
    } catch (error) {
        console.error("Error:", error);
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
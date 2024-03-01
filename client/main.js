const form = document.getElementById("TextForm");
const inputField = document.getElementById("input")
const instructionField = document.getElementById("instruction")
const submitButton = document.getElementById("submitButton");
const loader = document.getElementById("loader")
loader.classList.add("dn")

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
    
    const engineeredPrompt = `
You are a language critic. Someone has written the following text:
${inputText}
${instruction ? `They have also provided the following instructions: ${instruction}` : ''}
Please make sure it is grammatically correct. Respond with only the improved text with the following changes:
 - Write the text in HTML format, start with the p tag.
 - anything you changed from the origional text needs to have a span tag around it with the class "changes". This will show the user that has changed about their origional text.`;

    try {
        // Send POST request to the server with the input
        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({query: engineeredPrompt})
        });

        if (!response.ok) {
            new Error("Failed to submit question");
        }

        // Wait for response and show
        document.getElementById("response").innerHTML = await response.json();
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
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
You are a language critic. Someone has written the following text: ${inputText}
${instruction ? `They have also provided the following instructions: ${instruction}` : ''}
Please ensure it is grammatically correct. Respond with the improved text in HTML format, start with the p tag.
Any changes made from the original text should be wrapped in a span tag with the class "changes". This will indicate to the user what has been modified from their original text.`;

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
        const responseJSON = await response.json();
        console.log(responseJSON)
        document.getElementById("response").innerHTML = responseJSON
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
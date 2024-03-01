const form = document.getElementById("TextForm");
const submitButton = document.getElementById("submitButton");

document.getElementById("TextForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Disable the form when text has been submitted
    form.disabled = true;
    submitButton.disabled = true;

    // Get text from the form
    const formData = new FormData(this);
    const inputText = formData.get("input");
    const instruction = formData.get("instruction");
    const engineeredPrompt = `You are a language critic and make sure every text is written correctly. Someone has written this text: "${inputText}" ${ 
        instruction !== '' ? `and they have given an extra instruction you need to keep in mind: "${instruction}"` : ''} You need to make sure everything about the spelling and sentence structure is correct. Reply with only the improved text and nothing else.`;


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
        document.getElementById("response").value = await response.json();
    } catch (error) {
        console.error("Error:", error);
    }

        // Enable form again
    finally {
        form.disabled = false;
        submitButton.disabled = false;
    }
});
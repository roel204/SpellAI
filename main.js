document.getElementById("TextForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Disable the form when text has been submitted
    const form = document.getElementById("TextForm");
    const submitButton = document.getElementById("submitButton");
    form.disabled = true;
    submitButton.disabled = true;
    
    // Get text from the form
    const formData = new FormData(this);
    const input = formData.get("input");

    try {
        // Send POST request to the server with the input
        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: input })
        });

        if (!response.ok) {
            new Error("Failed to submit question");
        }

        // Wait for response and show
        document.getElementById("response").textContent = await response.json();
        
    } 
    
    catch (error) {
        console.error("Error:", error);
    } 
    
    // Enable form again
    finally {
        form.disabled = false;
        submitButton.disabled = false;
    }
});
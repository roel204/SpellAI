document.getElementById("questionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const question = formData.get("question");

    try {
        const response = await fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: question })
        });

        if (!response.ok) {
            new Error("Failed to submit question");
        }

        const responseData = await response.json();
        console.log("Response:", responseData);
    } catch (error) {
        console.error("Error:", error);
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/ai-data"); // Replace with the actual path to your JSON file
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error("Error fetching JSON file:", error);
    }
});

function displayData(data) {
    const container = document.getElementById("response"); 
    container.innerHTML = JSON.stringify(data, null, 2); // Display the JSON data in a readable format
}
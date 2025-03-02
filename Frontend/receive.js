// filepath: /Users/amirsamadian/Library/CloudStorage/OneDrive-King'sCollege/Coding Club/HenHacks 2025/HenHacks-2025-Chips/Frontend/receive.js

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/ai-data");
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
    console.log("displayData called");
    const container = document.getElementById("data-container");
    container.innerHTML = JSON.stringify(data, null, 2);
}
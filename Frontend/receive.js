// filepath: /Users/amirsamadian/Library/CloudStorage/OneDrive-King'sCollege/Coding Club/HenHacks 2025/HenHacks-2025-Chips/Frontend/receive.js

document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("DOMContentLoaded event fired for receive.js");
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
    const container = document.querySelector(".response");
    container.innerHTML = JSON.stringify(data, null, 2);

    const basic_list = document.querySelector(".basic_list");
    const important_list = document.querySelector(".important_list");
    const fill_list = document.querySelector(".fill_list");

    const basic = data.analysis.basic;
    const important = data.analysis.important;
    const fill = data.analysis.fill;

    for (const [key, value] of Object.entries(basic)) {
        const li = document.createElement("li");
        li.textContent = `${key}`;
        //Handle the value text somehow
        basic_list.appendChild(li);
    }
    for (const [key, value] of Object.entries(important)) {
        const li = document.createElement("li");
        li.textContent = `${key}`;
        //Handle the value text somehow
        basic_list.appendChild(li);
    }
    for (const [key, value] of Object.entries(fill)) {
        const li = document.createElement("li");
        li.textContent = `${key}`;
        //Handle the value text somehow
        if (value ===)
        basic_list.appendChild(li);
    }


    }





}
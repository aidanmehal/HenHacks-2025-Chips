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
    console.log(data);
    const container = document.querySelector(".response");
    // container.innerHTML = JSON.stringify(data, null, 2);

    const basic_list = document.querySelector(".basic_list");
    const important_list = document.querySelector(".important_list");
    const fill_list = document.querySelector(".fill_list");

    const basic = data.analysis.basic;
    console.log(basic);
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
        const li_none = document.createElement("li");
        li_none.textContent = "None";
        li.textContent = `${key}`;
        //Handle the value text somehow
        if (value === "") {
            important_list.appendChild(li_none);
        } else {
            fill_list.appendChild(li);
        }
        important_list.appendChild(li);
    }
    for (const [key, value] of Object.entries(fill)) {
        const li = document.createElement("li");
        li.textContent = `${key}`;
        //Handle the value text somehow
        if (value === "") {
            fill_list.remove();
        } else {
            fill_list.appendChild(li);
        }
    }
}
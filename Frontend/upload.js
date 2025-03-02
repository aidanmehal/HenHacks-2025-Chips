document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileLabel = document.getElementById("file-label");
    const uploadForm = document.getElementById("file-upload-form");
<<<<<<< HEAD
    const uploadInitialText = document.querySelector("#drop-area p"); 
=======
    const uploadButton = document.getElementById("upload_button");
>>>>>>> c032046766d2cf80beca6e427fd87f2150971791
    const statusMessage = document.getElementById("status-message");

    // Prevent default behaviors for drag events
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault(), false);
    });

    // Highlight drop area when a file is dragged over
    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.classList.add("highlight");
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropArea.classList.remove("highlight");
    });

    // Handle file drop
    dropArea.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files[0]);
        }
    });

    // Handle file selection via input
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files[0]);
        }
    });

<<<<<<< HEAD
    uploadForm.addEventListener("submit", (e) => {
        console.log("Submit event triggered!"); // Debugging
        e.preventDefault();
    });

    // The argument to this is one of the files from one of the two files arrays above
    function handleFiles(file) {
        if (["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
            const dataTransfer = new DataTransfer(); // Create a new DataTransfer object
            dataTransfer.items.add(file); // Add the file to DataTransfer
            fileInput.files = dataTransfer.files; // Assign the DataTransfer's FileList to fileInput.files
    
            fileLabel.textContent = `Selected: ${file.name}`; // Update the UI
            if (uploadInitialText) {
                uploadInitialText.innerHTML = '';
            } else {
                console.error("uploadInitialText not found! Check the selector.");
                console.log(document.querySelector("#drop-area p"));    //Removes old text
            }
=======
    function handleFiles(file) {
        if (["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
            fileLabel.textContent = `Selected: ${file.name}`;
>>>>>>> c032046766d2cf80beca6e427fd87f2150971791
        } else {
            alert("Only PDF and Word documents are allowed.");
        }
    }

<<<<<<< HEAD
/*
    // Handle form submission asynchronously
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission

=======
    // Handle file upload when clicking the upload button
    uploadButton.addEventListener("click", async () => {
>>>>>>> c032046766d2cf80beca6e427fd87f2150971791
        if (fileInput.files.length === 0) {
            statusMessage.textContent = "Please select a file first!";
            statusMessage.className = "error";
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            statusMessage.textContent = "Uploading...";
            statusMessage.className = "";

            // Step 1: Upload the file
            const uploadResponse = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadResult.error || "File upload failed.");
            }

            statusMessage.textContent = "File uploaded successfully!";
            statusMessage.className = "success";

            // Step 2: Analyze the document
            statusMessage.textContent = "Analyzing document...";
            const analyzeResponse = await fetch("/analyze", {
                method: "POST",
                body: formData // Send the same FormData to analysis
            });

            const analyzeResult = await analyzeResponse.json();

            if (!analyzeResponse.ok) {
                throw new Error(analyzeResult.error || "Analysis failed.");
            }

            statusMessage.textContent = "Analysis complete!";
            statusMessage.className = "success";

            // Display analysis results
            displayAnalysis(analyzeResult);
        } catch (error) {
            statusMessage.textContent = error.message;
            statusMessage.className = "error";
        }
    });

    function displayAnalysis(result) {
        const scrollContainer = document.querySelector(".scroll_container");
        let analysisDiv = document.getElementById("analysis-results");

        if (!analysisDiv) {
            analysisDiv = document.createElement("div");
            analysisDiv.id = "analysis-results";
            analysisDiv.style.marginTop = "20px";
            scrollContainer.appendChild(analysisDiv);
        }

        analysisDiv.innerHTML = `
            <h3>Document Analysis</h3>
            <p><strong>Document Safety Rating:</strong> ${result.rating?.rating}/10</p>
            <p>${result.rating?.reason}</p>
            <h4>Key Sections</h4>
            <pre>${JSON.stringify(result.analysis, null, 2)}</pre>
        `;
    }
});
*/

uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Upload button clicked!"); // Debugging

    if (fileInput.files.length === 0) {
        statusMessage.textContent = "Please select a file first!";
        statusMessage.className = "error";
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
        statusMessage.textContent = "Uploading...";
        statusMessage.className = "";

        console.log("Sending file:", file.name); // Debugging

        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        console.log("Response received:", response.status); // Debugging

        const result = await response.json();

        if (response.ok) {
            statusMessage.textContent = "Upload successful!";
            statusMessage.className = "success";
        } else {
            throw new Error(result.message || "Upload failed.");
        }
    } catch (error) {
        statusMessage.textContent = error.message;
        statusMessage.className = "error";
        console.error("Upload error:", error);
    }
});


<<<<<<< HEAD
});
=======
>>>>>>> c032046766d2cf80beca6e427fd87f2150971791

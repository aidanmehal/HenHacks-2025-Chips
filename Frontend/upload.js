document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileLabel = document.getElementById("file-label");
    const uploadForm = document.getElementById("file-upload-form");
    const uploadButton = document.getElementById("upload_button");
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

    function handleFiles(file) {
        if (["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
            fileLabel.textContent = `Selected: ${file.name}`;
        } else {
            alert("Only PDF and Word documents are allowed.");
        }
    }

    // Handle file upload when clicking the upload button
    uploadButton.addEventListener("click", async () => {
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



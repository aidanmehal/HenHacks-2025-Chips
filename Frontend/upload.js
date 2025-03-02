document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileLabel = document.getElementById("file-label");
    const uploadForm = document.getElementById("file-upload-form");
    const statusMessage = document.getElementById("status-message");

    // Prevent default behaviors for drag events such as the browser opening the file when the file is dropped
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault(), false);
    });

     // Highlight drop area when a file is dragged over
    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add("highlight"), false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove("highlight"), false);
    });

    // Handle file drop. 
    // e is the event object that gets created when the drop event is triggered. 
    // e.dataTransfer.files is an array of files that were dropped.
    // We only handle the first file that was dropped by calling handleFiles().
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

    // The argument to this is one of the files from one of the two files arrays above
    function handleFiles(file) {
        if (["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) { //Check that the file passed is a PDF or Word document (MIME type)
            fileInput.files = new DataTransfer().files = [file]; //adds the file to a virtual-clipboard like container object. This gets assigned to the file input element's files property so it shows that a file got added cause that doesn't automatically happen unless the file is selected from clicking.
            fileLabel.textContent = `Selected: ${file.name}`; //DOM manipulation to show the name of the file that was selected
        } else {
            alert("Only PDF and Word documents are allowed.");
        }
    }

    // Handle form submission asynchronously
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (fileInput.files.length === 0) {
            statusMessage.textContent = "Please select a file first!";
            statusMessage.className = "error";
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData(); //FormData is a built-in object that allows easy construction of key/value pairs which represent form fields and their values
        formData.append("file", file);

        try {
            statusMessage.textContent = "Uploading...";
            statusMessage.className = "";

            //Asynchronous code to sent the file to the server through fetch API call
            const response = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            //The server will respond with a JSON object that contains a message property if the upload was successful
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
        }
    });
});





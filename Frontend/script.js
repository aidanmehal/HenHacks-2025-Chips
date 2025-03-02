/* Burger and Sidebar functionalities for header*/
function showSidebar() {
    const sidebar = document.querySelector('.phone_menu');
    sidebar.style.display = 'flex';
}
function closeSidebar() {
    const sidebar = document.querySelector('.phone_menu');
    sidebar.style.display = 'none';
}

async function addData() {
    // 1) Prevent default form submission
    event.preventDefault();
  
    // 2) Grab form values
    const username = document.getElementById("username_input").value;
    const email = document.getElementById("email_input").value;
    const password = document.getElementById("password_input").value;
    const repeatPassword = document.getElementById("repeat_password_input").value;
  
    // (Optional) Check if passwords match
    if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return false; // stops submission
    }
  
    try {
      // 3) Send POST request to our backend route
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      });
  
      if (!response.ok) {
        const errorMsg = await response.text();
        console.error("Server error:", errorMsg);
        alert("Error creating account.");
        return false;
      }
  
      // 4) Handle success
      const data = await response.json();
      console.log("Success:", data);
      alert("Account created successfully!");
  
      // Optionally redirect to a "welcome" or "login" page
      // window.location.href = "login.html";
  
      return false; // to prevent default form submit
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error creating account.");
      return false;
    }
  }
  
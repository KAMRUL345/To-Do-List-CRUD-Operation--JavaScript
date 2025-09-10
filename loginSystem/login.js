// Predefined Users (Demo purpose)
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("⚠ Please enter both username and password!");
    return;
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Save current user info to localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`✅ Login successful! Role: ${user.role}`);
    window.location.href = "index.html"; // Redirect to main CRUD page
  } else {
    alert("❌ Invalid username or password!");
  }
}

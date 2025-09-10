let selectedRow = null;

// Load data when page loads
window.onload = function () {
  showData();
};

// Add or Update Data
function addData() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (name === "" || email === "") {
    alert("⚠ Please enter both name and email!");
    return;
  }

  let data = JSON.parse(localStorage.getItem("crudData")) || [];

  if (selectedRow === null) {
    // Add new record
    data.push({ name, email });
  } else {
    // Update record
    data[selectedRow] = { name, email };
    selectedRow = null;
  }

  localStorage.setItem("crudData", JSON.stringify(data));
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  showData();
}

// Display Data
function showData() {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  let table = document.getElementById("dataTable");
  table.innerHTML = "";

  data.forEach((item, index) => {
    let row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editData(${index})">✏ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteData(${index})">🗑 Delete</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// Edit Data
function editData(index) {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  document.getElementById("name").value = data[index].name;
  document.getElementById("email").value = data[index].email;
  selectedRow = index;
}

// Delete Data
function deleteData(index) {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  if (confirm("❓ Are you sure to delete this record?")) {
    data.splice(index, 1);
    localStorage.setItem("crudData", JSON.stringify(data));
    showData();
  }
}

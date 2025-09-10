let selectedRow = null;

// Load data when page loads
window.onload = function () {
  showData();
};

// Add or Update Data
function addData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (name === "" || email === "") {
    alert("Please enter both name and email");
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
  let table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
  table.innerHTML = "";

  data.forEach((item, index) => {
    let row = table.insertRow();
    row.insertCell(0).innerHTML = item.name;
    row.insertCell(1).innerHTML = item.email;
    row.insertCell(2).innerHTML = `
      <button onclick="editData(${index})">Edit</button>
      <button onclick="deleteData(${index})">Delete</button>
    `;
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
  if (confirm("Are you sure to delete this record?")) {
    data.splice(index, 1);
    localStorage.setItem("crudData", JSON.stringify(data));
    showData();
  }
}

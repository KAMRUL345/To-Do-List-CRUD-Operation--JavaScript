let selectedRow = null;

// Add Data
function addData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (name === "" || email === "") {
    alert("Please enter both name and email");
    return;
  }

  const table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];

  if (selectedRow == null) {
    // Create New Row
    let newRow = table.insertRow();
    newRow.insertCell(0).innerHTML = name;
    newRow.insertCell(1).innerHTML = email;
    newRow.insertCell(2).innerHTML = `
      <button onclick="editData(this)">Edit</button>
      <button onclick="deleteData(this)">Delete</button>
    `;
  } else {
    // Update Existing Row
    selectedRow.cells[0].innerHTML = name;
    selectedRow.cells[1].innerHTML = email;
    selectedRow = null;
  }

  // Reset Input
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
}

// Edit Data
function editData(td) {
  selectedRow = td.parentElement.parentElement;
  document.getElementById("name").value = selectedRow.cells[0].innerHTML;
  document.getElementById("email").value = selectedRow.cells[1].innerHTML;
}

// Delete Data
function deleteData(td) {
  if (confirm("Are you sure to delete this record?")) {
    let row = td.parentElement.parentElement;
    document.getElementById("dataTable").deleteRow(row.rowIndex);
  }
}

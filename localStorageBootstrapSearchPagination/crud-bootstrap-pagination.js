let selectedRow = null;
let currentPage = 1;
let rowsPerPage = 5; // প্রতি পেজে কয়টা রেকর্ড দেখাবে

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

// Display Data with Pagination
function showData() {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  let table = document.getElementById("dataTable");
  table.innerHTML = "";

  // Pagination Logic
  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let paginatedData = data.slice(start, end);

  paginatedData.forEach((item, index) => {
    let row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editData(${start + index})">✏ Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteData(${start + index})">🗑 Delete</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });

  setupPagination(data.length);
}

// Setup Pagination
function setupPagination(totalItems) {
  let pageCount = Math.ceil(totalItems / rowsPerPage);
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {
    let li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.onclick = function () {
      currentPage = i;
      showData();
    };
    pagination.appendChild(li);
  }
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

    // If last item deleted on last page → go back one page
    let maxPage = Math.ceil(data.length / rowsPerPage);
    if (currentPage > maxPage) currentPage = maxPage;

    showData();
  }
}

// 🔍 Search / Filter Data
function searchData() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let rows = document.querySelectorAll("#dataTable tr");

  rows.forEach(row => {
    let name = row.cells[0].innerText.toLowerCase();
    let email = row.cells[1].innerText.toLowerCase();

    if (name.includes(input) || email.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

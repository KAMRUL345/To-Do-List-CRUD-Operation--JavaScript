let selectedRow = null;
let currentPage = 1;
let rowsPerPage = 5;



// Load data when page loads
window.onload = function () {
  showData();
};

let currentRole = "admin"; // ডিফল্ট Admin

// Role সেট করা
function setRole(role) {
  currentRole = role;
  showData();

  // যদি User হয় → Add Form, Import/Export, Edit/Delete বাটন লুকানো হবে
  if (role === "user") {
    document.querySelector(".card.shadow.p-4.mb-4").style.display = "none"; // Add Form hide
    document.querySelector(".card.shadow.p-3.mb-3").style.display = "none"; // Search + Import/Export hide
  } else {
    document.querySelector(".card.shadow.p-4.mb-4").style.display = "block";
    document.querySelector(".card.shadow.p-3.mb-3").style.display = "block";
  }
}


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
    data.push({ name, email });
  } else {
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

  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let paginatedData = data.slice(start, end);

  paginatedData.forEach((item, index) => {
  let actionButtons = "";

  if (currentRole === "admin") {
    actionButtons = `
      <button class="btn btn-warning btn-sm" onclick="editData(${start + index})">✏ Edit</button>
      <button class="btn btn-danger btn-sm" onclick="deleteData(${start + index})">🗑 Delete</button>
    `;
  } else {
    actionButtons = `<span class="badge bg-secondary">View Only</span>`;
  }

  let row = `
    <tr>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${actionButtons}</td>
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

// 📥 Export to CSV
function exportToCSV() {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  if (data.length === 0) {
    alert("⚠ No data to export!");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Name,Email\n";
  data.forEach(item => {
    csvContent += `${item.name},${item.email}\n`;
  });

  let link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "crud_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 📥 Export to Excel
function exportToExcel() {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  if (data.length === 0) {
    alert("⚠ No data to export!");
    return;
  }

  let tableHTML = "<table border='1'><tr><th>Name</th><th>Email</th></tr>";
  data.forEach(item => {
    tableHTML += `<tr><td>${item.name}</td><td>${item.email}</td></tr>`;
  });
  tableHTML += "</table>";

  let blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "crud_data.xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 📤 Import CSV/Excel
function importFile(event) {
  let file = event.target.files[0];
  if (!file) return;

  let reader = new FileReader();
  let extension = file.name.split(".").pop().toLowerCase();

  if (extension === "csv") {
    reader.onload = function (e) {
      let text = e.target.result;
      let rows = text.split("\n").slice(1); // skip header
      let importedData = rows
        .map(row => {
          let cols = row.split(",");
          return cols.length >= 2 ? { name: cols[0].trim(), email: cols[1].trim() } : null;
        })
        .filter(item => item && item.name && item.email);

      saveImportedData(importedData);
    };
    reader.readAsText(file);
  } else if (extension === "xls" || extension === "xlsx") {
    reader.onload = function (e) {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: "array" });
      let sheet = workbook.Sheets[workbook.SheetNames[0]];
      let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      let importedData = jsonData.slice(1).map(row => ({
        name: row[0],
        email: row[1]
      })).filter(item => item.name && item.email);

      saveImportedData(importedData);
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("⚠ Please select a CSV or Excel file!");
  }
}

// Save Imported Data to LocalStorage
function saveImportedData(importedData) {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  data = data.concat(importedData); // merge with old data
  localStorage.setItem("crudData", JSON.stringify(data));
  showData();
  alert("✅ Data imported successfully!");
}


// 🖨 Print Function
function printTable() {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  if (data.length === 0) {
    alert("⚠ No data to print!");
    return;
  }

  let printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write("<html><head><title>Print Data</title>");
  printWindow.document.write("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'>");
  printWindow.document.write("</head><body>");
  printWindow.document.write("<h3 class='text-center mb-3'>CRUD Data Report</h3>");
  printWindow.document.write("<table class='table table-bordered table-striped'><thead><tr><th>Name</th><th>Email</th></tr></thead><tbody>");

  data.forEach(item => {
    printWindow.document.write(`<tr><td>${item.name}</td><td>${item.email}</td></tr>`);
  });

  printWindow.document.write("</tbody></table>");
  printWindow.document.write("</body></html>");
  printWindow.document.close();
  printWindow.print();
}

// 📑 Export to PDF
function exportToPDF() {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];
  if (data.length === 0) {
    alert("⚠ No data to export!");
    return;
  }

  // jsPDF লাইব্রেরি ব্যবহার
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("CRUD Data Report", 14, 15);

  let rows = data.map(item => [item.name, item.email]);

  doc.autoTable({
    head: [["Name", "Email"]],
    body: rows,
    startY: 25,
  });

  doc.save("crud_data.pdf");
}


let sortColumn = null;
let sortOrder = "asc"; // asc = ascending, desc = descending

// 🔽 Sort Table Function
function sortTable(column) {
  let data = JSON.parse(localStorage.getItem("crudData")) || [];

  if (sortColumn === column) {
    // একি কলামে বারবার ক্লিক করলে অর্ডার পাল্টাবে
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    sortColumn = column;
    sortOrder = "asc";
  }

  data.sort((a, b) => {
    let valA = a[column].toLowerCase();
    let valB = b[column].toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  localStorage.setItem("crudData", JSON.stringify(data));
  showData();
}

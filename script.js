document.addEventListener("DOMContentLoaded", function () {
    setTodayDate();
    loadExpenses();
    updateTotal();
});

// Set today's date
function setTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById("expense-date").value = `${year}-${month}-${day}`;
}

// Add expense
document.getElementById("add-expense-btn").addEventListener("click", function () {
    const date = document.getElementById("expense-date").value;
    const description = document.getElementById("expense-desc").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value.trim());
    const category = document.getElementById("expense-category").value;

    if (!date || !description || isNaN(amount) || !category) {
        alert("Please fill all fields correctly.");
        return;
    }

    const expense = { id: Date.now(), date: formatDisplayDate(date), description, amount, category };
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    addExpenseToTable(expense);
    updateTotal();

    document.getElementById("expense-form").reset();
    setTodayDate();
});

// Load expenses from localStorage
function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.forEach(addExpenseToTable);
}

// Add a single expense to the table
function addExpenseToTable(expense) {
    const tableBody = document.getElementById("expense-list");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td class="text-center">${expense.date}</td>
        <td class="text-start">${expense.description}</td>
        <td class="text-end">₹${formatCurrency(expense.amount)}</td>
        <td class="text-start">${expense.category}</td>
        <td class="text-center"><button class="btn btn-danger btn-sm delete-btn" data-id="${expense.id}">Delete</button></td>
    `;

    tableBody.appendChild(row);
}

// Delete expense
document.getElementById("expense-list").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const id = event.target.getAttribute("data-id");
        deleteExpense(id);
        event.target.closest("tr").remove();
        updateTotal();
    }
});

// Delete expense from localStorage
function deleteExpense(id) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter(expense => expense.id !== parseInt(id));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update total expense
function updateTotal() {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById("total-expense").innerText = `₹${formatCurrency(total)}`;
}

// Format date from yyyy-mm-dd to dd-mm-yyyy
function formatDisplayDate(dateInput) {
    const parts = dateInput.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Format amount in INR
function formatCurrency(amount) {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

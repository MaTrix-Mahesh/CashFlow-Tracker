// Data State
let salary = parseFloat(localStorage.getItem('walletSalary')) || 0;
let expenses = JSON.parse(localStorage.getItem('walletExpenses')) || [];

// UI Elements
const displaySalary = document.getElementById('display-salary');
const displayExpenses = document.getElementById('display-expenses');
const displayBalance = document.getElementById('display-balance');
const expenseList = document.getElementById('expense-list');
const balanceCard = document.getElementById('balance-card');

// Start the app
window.onload = refreshUI;

function refreshUI() {
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = salary - totalExpenses;

    // Update Headings (English labels with Indian Currency)
    displaySalary.innerText = formatCurrency(salary);
    displayExpenses.innerText = formatCurrency(totalExpenses);
    displayBalance.innerText = formatCurrency(balance);

    // Modern Low Balance Check
    if (balance < 1000 && salary > 0) {
        balanceCard.classList.add('low-balance');
    } else {
        balanceCard.classList.remove('low-balance');
    }

    renderList();
    saveData();
}

function formatCurrency(num) {
    return "₹" + num.toLocaleString('en-IN');
}

function renderList() {
    expenseList.innerHTML = '';
    
    if (expenses.length === 0) {
        expenseList.innerHTML = '<p style="text-align:center; color:#94a3b8; padding:20px;">No transactions yet.</p>';
        return;
    }

    expenses.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div class="expense-info">
                <span class="name">${item.name}</span>
                <span class="amt">-${formatCurrency(item.amount)}</span>
            </div>
            <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
}

function saveData() {
    localStorage.setItem('walletSalary', salary);
    localStorage.setItem('walletExpenses', JSON.stringify(expenses));
}

// Interactions
document.getElementById('set-salary-btn').onclick = () => {
    const input = document.getElementById('salary-input');
    const val = parseFloat(input.value);

    if (isNaN(val) || val < 0) {
        alert("Please enter a valid salary.");
        return;
    }

    salary = val;
    input.value = '';
    refreshUI();
};

document.getElementById('add-expense-btn').onclick = () => {
    const nameInput = document.getElementById('expense-name');
    const amtInput = document.getElementById('expense-amount');
    
    const name = nameInput.value.trim();
    const amount = parseFloat(amtInput.value);

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense details.");
        return;
    }

    expenses.unshift({ name, amount }); // Adds to top of list
    nameInput.value = '';
    amtInput.value = '';
    refreshUI();
};

function deleteItem(index) {
    expenses.splice(index, 1);
    refreshUI();
}
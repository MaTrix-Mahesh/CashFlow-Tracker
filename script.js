// --- SELECTORS ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const root = document.documentElement;

const salaryInput = document.getElementById('salary-input');
const expNameInput = document.getElementById('expense-name');
const expAmountInput = document.getElementById('expense-amount');

const displaySalary = document.getElementById('display-salary');
const displayExpenses = document.getElementById('display-expenses');
const displayBalance = document.getElementById('display-balance');
const expenseList = document.getElementById('expense-list');
const balanceCard = document.getElementById('balance-card');

// --- DATA STATE ---
let salary = parseFloat(localStorage.getItem('mySalary')) || 0;
let expenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';

// --- INITIALIZE ---
window.onload = () => {
    applyTheme(currentTheme);
    refreshApp();
};

// --- THEME LOGIC ---
function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeIcon.innerText = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

themeToggle.onclick = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
};

// --- CORE APP LOGIC ---
function refreshApp() {
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = salary - totalExpenses;

    // Update UI Cards
    displaySalary.innerText = formatINR(salary);
    displayExpenses.innerText = formatINR(totalExpenses);
    displayBalance.innerText = formatINR(balance);

    // Low balance visual (below ₹1000)
    if (balance < 1000 && salary > 0) {
        balanceCard.classList.add('low-balance');
    } else {
        balanceCard.classList.remove('low-balance');
    }

    renderExpenses();
    saveData();
}

function formatINR(num) {
    return "₹" + num.toLocaleString('en-IN');
}

function renderExpenses() {
    expenseList.innerHTML = '';
    
    if (expenses.length === 0) {
        expenseList.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">No transactions found.</p>`;
        return;
    }

    expenses.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div>
                <span style="display:block; font-weight:600;">${item.name}</span>
                <span style="color:var(--danger); font-size:0.85rem;">-${formatINR(item.amount)}</span>
            </div>
            <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
}

function saveData() {
    localStorage.setItem('mySalary', salary);
    localStorage.setItem('myExpenses', JSON.stringify(expenses));
}

// --- EVENTS ---

document.getElementById('set-salary-btn').onclick = () => {
    const val = parseFloat(salaryInput.value);
    if (!isNaN(val) && val >= 0) {
        salary = val;
        salaryInput.value = '';
        refreshApp();
    } else {
        alert("Please enter a valid salary amount.");
    }
};

document.getElementById('add-expense-btn').onclick = () => {
    const name = expNameInput.value.trim();
    const amount = parseFloat(expAmountInput.value);

    if (name && !isNaN(amount) && amount > 0) {
        expenses.unshift({ name, amount }); // Add to top
        expNameInput.value = '';
        expAmountInput.value = '';
        refreshApp();
    } else {
        alert("Enter valid name and amount.");
    }
};

function deleteEntry(index) {
    expenses.splice(index, 1);
    refreshApp();
}
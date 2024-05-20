let selectedRow = null;
let originalTableContent = [];

document.getElementById('enter').addEventListener('click', addRow);
document.getElementById('price').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addRow();
    }
});

document.getElementById('download').addEventListener('click', downloadExcel);
document.getElementById('clearTable').addEventListener('click', clearTable);
document.getElementById('update').addEventListener('click', updateRow);
document.getElementById('sortName').addEventListener('click', sortTableByName);
document.getElementById('unsortName').addEventListener('click', unsortTable);

// Add event listeners to pre-price buttons
document.querySelectorAll('.pre-price').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('price').value = this.getAttribute('data-price');
    });
});

// Load table content from localStorage on page load
window.addEventListener('load', function() {
    const savedContent = localStorage.getItem('tableContent');
    if (savedContent) {
        originalTableContent = JSON.parse(savedContent);
        setTableContent(originalTableContent);
    }
});

function addRow() {
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;

    if (code && name && price) {
        const table = document.getElementById('minerTable');
        const row = table.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.textContent = code;
        cell2.textContent = name;
        cell3.textContent = `₱ ${parseFloat(price).toFixed(2)}`;
        cell4.innerHTML = '<button class="edit-button" onclick="editRow(this)">Edit</button> <button class="delete-button" onclick="deleteRow(this)">Delete</button>';

        // Clear input fields
        document.getElementById('code').value = '';
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';

        document.getElementById('code').focus();

        // Update total price
        updateTotalPrice();
        
        // Save original table content to localStorage
        originalTableContent = getTableContent();
        localStorage.setItem('tableContent', JSON.stringify(originalTableContent));
    } else {
        alert('Please fill in all fields.');
    }
}

function updateRow() {
    const code = document.getElementById('code').value;
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;

    if (selectedRow && code && name && price) {
        selectedRow.cells[0].textContent = code;
        selectedRow.cells[1].textContent = name;
        selectedRow.cells[2].textContent = `₱ ${parseFloat(price).toFixed(2)}`;

        document.getElementById('enter').style.display = '';
        document.getElementById('update').style.display = 'none';

        selectedRow = null;

        // Clear input fields
        document.getElementById('code').value = '';
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';

        document.getElementById('code').focus();

        // Update total price
        updateTotalPrice();
        
        // Save original table content to localStorage
        originalTableContent = getTableContent();
        localStorage.setItem('tableContent', JSON.stringify(originalTableContent));
    } else {
        alert('Please fill in all fields.');
    }
}

function editRow(button) {
    selectedRow = button.parentElement.parentElement;
    document.getElementById('code').value = selectedRow.cells[0].textContent;
    document.getElementById('name').value = selectedRow.cells[1].textContent;
    document.getElementById('price').value = selectedRow.cells[2].textContent.replace('₱', '').trim();

    document.getElementById('enter').style.display = 'none';
    document.getElementById('update').style.display = '';
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.parentElement.removeChild(row);

    // Update total price
    updateTotalPrice();
    
    // Save original table content to localStorage
    originalTableContent = getTableContent();
    localStorage.setItem('tableContent', JSON.stringify(originalTableContent));
}

function clearTable() {
    const table = document.getElementById('minerTable');
    table.innerHTML = '';
    updateTotalPrice();
    
    // Clear original table content from localStorage
    localStorage.removeItem('tableContent');
}

function updateTotalPrice() {
    const table = document.getElementById('minerTable');
    let total = 0;

    for (let i = 0, row; row = table.rows[i]; i++) {
        const priceCell = row.cells[2].textContent.replace('₱', '').replace(',', '');
        total += parseFloat(priceCell) || 0;
    }

    document.getElementById('totalPrice').textContent = `₱ ${total.toFixed(2)}`;

    checkForMilestones(total);
}

function checkForMilestones(total) {
    if (total >= 100000) { 
        triggerConfetti(100000);
    } 
    else if (total >= 50000) {
        triggerConfetti(50000);
    }
    else if (total >= 20000) {
        triggerConfetti(20000);
    }
    else if (total >= 10000) {
        triggerConfetti(10000);
    } else if (total >= 5000) {
        triggerConfetti(5000);
    }
}

function triggerConfetti(milestone, total) {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    const messageContainer = document.getElementById('confetti-message');
    messageContainer.textContent = `Congratulations! You've reached a milestone: ₱ ${milestone.toFixed(2)}!`;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000); // Hide the message after 5 seconds
}

function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws_data = [['Code', 'Name', 'Price']];
    const table = document.getElementById('minerTable');
    
    for (let i = 0, row; row = table.rows[i]; i++) {
        const code = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const price = row.cells[2].textContent;
        ws_data.push([code, name, price]);
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'miners_data.xlsx');
}

function sortTableByName() {
    const table = document.getElementById('minerTable');
    const rows = Array.from(table.rows);
    rows.sort((a, b) => a.cells[1].textContent.localeCompare(b.cells[1].textContent));

    rows.forEach(row => table.appendChild(row));

    document.getElementById('sortName').style.display = 'none';
    document.getElementById('unsortName').style.display = '';
}

function unsortTable() {
    setTableContent(originalTableContent);
    document.getElementById('sortName').style.display = '';
    document.getElementById('unsortName').style.display = 'none';
}

function getTableContent() {
    const table = document.getElementById('minerTable');
    const content = [];

    for (let i = 0, row; row = table.rows[i]; i++) {
        content.push({
            code: row.cells[0].textContent,
            name: row.cells[1].textContent,
            price: row.cells[2].textContent
        });
    }

    return content;
}

function setTableContent(content) {
    const table = document.getElementById('minerTable');
    table.innerHTML = '';

    content.forEach(item => {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);

        cell1.textContent = item.code;
        cell2.textContent = item.name;
        cell3.textContent = item.price;
        cell4.innerHTML = '<button class="edit-button" onclick="editRow(this)">Edit</button> <button class="delete-button" onclick="deleteRow(this)">Delete</button>';
    });

    updateTotalPrice();
}

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
}

function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws_data = [['Code', 'Name of Miner', 'Price']];
    const table = document.getElementById('minerTable');
    
    for (let i = 0, row; row = table.rows[i]; i++) {
        const code = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const price = row.cells[2].textContent;
        ws_data.push([code, name, price]);
    }

    const totalPrice = document.getElementById('totalPrice').textContent;
    ws_data.push(['', 'Total', totalPrice]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const dayName = daysOfWeek[today.getDay()];

    const fileName = `${dayName}_live_houseOfElle.xlsx`;
    XLSX.writeFile(wb, fileName);
}

function getTableContent() {
    const table = document.getElementById('minerTable');
    const rows = Array.from(table.rows);
    return rows.map(row => ({
        code: row.cells[0].textContent,
        name: row.cells[1].textContent,
        price: row.cells[2].textContent
    }));
}

function setTableContent(content) {
    const table = document.getElementById('minerTable');
    table.innerHTML = '';
    content.forEach(item => {
        const row = table.insertRow();
        row.insertCell(0).textContent = item.code;
        row.insertCell(1).textContent = item.name;
        row.insertCell(2).textContent = item.price;
        row.insertCell(3).innerHTML = '<button class="edit-button" onclick="editRow(this)">Edit</button> <button class="delete-button" onclick="deleteRow(this)">Delete</button>';
    });
    updateTotalPrice();
}

function sortTableByName() {
    const table = document.getElementById('minerTable');
    const rows = Array.from(table.rows);

    rows.sort((a, b) => {
        const nameA = a.cells[1].textContent.toUpperCase();
        const nameB = b.cells[1].textContent.toUpperCase();
        return nameA.localeCompare(nameB);
    });

    setTableContent(rows.map(row => ({
        code: row.cells[0].textContent,
        name: row.cells[1].textContent,
        price: row.cells[2].textContent
    })));

    document.getElementById('sortName').style.display = 'none';
    document.getElementById('unsortName').style.display = 'inline-block';
}

function unsortTable() {
    setTableContent(originalTableContent);
    document.getElementById('sortName').style.display = 'inline-block';
    document.getElementById('unsortName').style.display = 'none';
}

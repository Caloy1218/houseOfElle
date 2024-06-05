let selectedRow = null;
let originalTableContent = [];
let milestones = [5000, 10000, 20000, 50000, 100000];
let lastMilestoneIndex = -1;

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
        cell4.innerHTML = '<button class="edit-button" onclick="editRow(this)">Edit</button> <button class="delete-button" onclick="deleteRow(this)">Delete</button> <button class="checkout-button">Checkout</button>';

        // Clear input fields
        document.getElementById('code').value = '';
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';

        document.getElementById('code').focus();

        // Save data to database
        saveToDatabase(code, name, price);
        
        // Update total price
        updateTotalPrice();
        
        // Save original table content to localStorage
        originalTableContent = getTableContent();
        localStorage.setItem('tableContent', JSON.stringify(originalTableContent));
    } else {
        alert('Please fill in all fields.');
    }
}

function saveToDatabase(code, name, price) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "save_miner.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.send(`code=${code}&name=${name}&price=${price}`);
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
    lastMilestoneIndex = -1; // Reset milestone tracking
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
    for (let i = lastMilestoneIndex + 1; i < milestones.length; i++) {
        if (total >= milestones[i]) {
            lastMilestoneIndex = i;
            triggerConfetti(milestones[i]);
        }
    }
}

function triggerConfetti(milestone) {
    // Trigger confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Play Mario sound
    playMarioSound();

    // Show confetti message
    const messageContainer = document.getElementById('confetti-message');
    messageContainer.textContent = `Congratulations! You've reached a milestone: ₱ ${milestone.toFixed(2)}!`;
    messageContainer.style.display = 'block';

    // Trigger balloons
    triggerBalloons();

    // Hide the message after 3 seconds
    setTimeout(() => {
        messageContainer.style.display = 'none';
        document.getElementById('balloon-container').style.display = 'none';
    }, 3000); // Hide the message after 3 seconds
}

function playMarioSound() {
    const marioSound = document.getElementById('mario-sound');
    marioSound.play();
}

function triggerBalloons() {
    const balloonContainer = document.getElementById('balloon-container');
    balloonContainer.innerHTML = ''; // Clear any existing balloons

    // Create 10 balloons with different colors and positions
    for (let i = 0; i < 10; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.setProperty('--balloon-color', getRandomColor());
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloonContainer.appendChild(balloon);
    }

    balloonContainer.style.display = 'block';
}

function getRandomColor() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'lime', 'magenta'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws_data = [["Code", "Name of Miner", "Price"]];

    const table = document.getElementById('minerTable');
    for (let i = 0, row; row = table.rows[i]; i++) {
        const rowData = [
            row.cells[0].textContent,
            row.cells[1].textContent,
            row.cells[2].textContent
        ];
        ws_data.push(rowData);
    }

    // Add total price and checkout total price to the data
    ws_data.push(["Total Price", "", document.getElementById('totalPrice').textContent]);
    ws_data.push(["Checkout Total", "", document.getElementById('checkoutTotal').textContent]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate file name with current date in Filipino format (DD-MM-YYYY)
    const currentDate = new Date().toLocaleDateString('en-PH').split('/').reverse().join('-');
    const fileName = `HouseOfElle_miners_${currentDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
}

document.getElementById('undoButton').addEventListener('click', undoPage);

function undoPage() {
    clearTable();
    setTableContent(originalTableContent);
}


document.getElementById('minerTable').addEventListener('click', function(event) {
    if (event.target.classList.contains('checkout-button')) {
        const row = event.target.closest('tr');
        const priceCell = row.cells[2].textContent.replace('₱', '').replace(',', '');
        const totalPrice = parseFloat(document.getElementById('checkoutTotal').textContent.replace('₱', '')) || 0;
        const newTotalPrice = totalPrice + parseFloat(priceCell);
        document.getElementById('checkoutTotal').textContent = `₱ ${newTotalPrice.toFixed(2)}`;
        
        // Change background color to yellow
        row.cells[1].style.backgroundColor = '#007bff';
        row.cells[1].style.color = '#ffffff';
        row.cells[0].style.backgroundColor = '#007bff';
        row.cells[0].style.color = '#ffffff';
        row.cells[2].style.backgroundColor = '#007bff';
        row.cells[2].style.color = '#ffffff';
    }
});

document.getElementById("dataBase").addEventListener("click", function() {
    window.location.href = "dataBase.html";
});

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
        content.push([
            row.cells[0].textContent,
            row.cells[1].textContent,
            row.cells[2].textContent
        ]);
    }

    return content;
}

function setTableContent(content) {
    const table = document.getElementById('minerTable');
    table.innerHTML = '';

    content.forEach(rowData => {
        const row = table.insertRow();

        row.insertCell(0).textContent = rowData[0];
        row.insertCell(1).textContent = rowData[1];
        row.insertCell(2).textContent = rowData[2];
        row.insertCell(3).innerHTML = '<button class="edit-button" onclick="editRow(this)">Edit</button> <button class="delete-button" onclick="deleteRow(this)">Delete</button> <button class="checkout-button">Checkout</button>'; // Add the "Checkout" button

        // Check if this row was previously checked out
        if (rowData[3] === 'checked') {
            row.cells[1].classList.add('yellow-background'); // Add background color
            row.cells[1].classList.add('white'); // Change text color
        }
    });

    updateTotalPrice();
}

document.getElementById('searchButton').addEventListener('click', searchMiner);

function searchMiner() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('minerTable');
    let total = 0;
    let found = false;

    if (!searchValue.trim()) {
        showToast("Please enter a miner's name.");
        return;
    }

    for (let i = 0, row; row = table.rows[i]; i++) {
        const minerName = row.cells[1].textContent.toLowerCase();
        const priceCell = row.cells[2].textContent.replace('₱', '').replace(',', '');
        
        if (minerName.includes(searchValue)) {
            row.style.display = '';
            total += parseFloat(priceCell) || 0;
            found = true;
        } else {
            row.style.display = 'none';
        }
    }

    document.getElementById('totalPrice').textContent = `₱ ${total.toFixed(2)}`;

    if (total > 0 && found) {
        showToast(`Total price of ${searchValue}: ₱ ${total.toFixed(2)}`);
    } else if (!found) {
        showToast(`No miners found with the name: ${searchValue}`);
    }
}

function showToast(message) {
    const toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container');
    toastContainer.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="exit-button" onclick="exitToast()">X</button>
    `;
    document.body.appendChild(toastContainer);

    setTimeout(() => {
        toastContainer.classList.add('show');
    }, 100);

    setTimeout(() => {
        exitToast();
    }, 5000); // Close the toast after 5 seconds
}

function exitToast() {
    const toastContainer = document.querySelector('.toast-container');
    if (toastContainer) {
        toastContainer.classList.remove('show');
        setTimeout(() => {
            toastContainer.remove();
        }, 300); // Remove the toast container after the transition ends
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const scrollButton = document.getElementById('scrollButton');

    // Function to toggle scroll button icon and scroll the page
    function toggleScrollButton() {
        if (document.documentElement.scrollTop > 0) {
            scrollButton.innerHTML = '&#9650;'; // Change to up arrow
        } else {
            scrollButton.innerHTML = '&#9660;'; // Change to down arrow
        }
    }

    // Event listener for scroll button click
    scrollButton.addEventListener('click', function() {
        if (document.documentElement.scrollTop > 0) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    });

    // Event listener for scroll events
    window.addEventListener('scroll', toggleScrollButton);
});
document.addEventListener('DOMContentLoaded', (event) => {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'SignupForm.html';
    });
});
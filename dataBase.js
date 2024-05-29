// Define month names
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Initialize current year and month
var currentYear = 2024;
var currentMonth = 0; // January

// Function to generate calendar for a given year and month
function generateCalendar(year, month) {
    var startDate = new Date(year, month, 1);
    var endDate = new Date(year, month + 1, 0);
    var tableBody = document.querySelector('#calendar tbody');
    tableBody.innerHTML = '';

    var row = document.createElement('tr');

    // Fill the space for the days of the week before the first day of the month
    for (var i = 0; i < startDate.getDay(); i++) {
        row.appendChild(document.createElement('td'));
    }

    // Fill in the days of the month
    for (var date = startDate.getDate(); date <= endDate.getDate(); date++) {
        var cell = document.createElement('td');
        cell.textContent = date;
        row.appendChild(cell);

        // Add click event listener to each date
        cell.addEventListener('click', function() {
            alert('You clicked on ' + monthNames[month] + ' ' + this.textContent + ', ' + year);
        });
        
        if (row.children.length === 7) {
            tableBody.appendChild(row);
            row = document.createElement('tr');
        }
    }

    // Fill the remaining space for the days of the week after the last day of the month
    for (var i = row.children.length; i < 7; i++) {
        row.appendChild(document.createElement('td'));
    }

    tableBody.appendChild(row);

    // Update month and year in the heading
    document.getElementById('month-year').textContent = monthNames[month] + ' ' + year;
}

// Generate the calendar for the initial month
generateCalendar(currentYear, currentMonth);

// Event listener for next month button
document.getElementById('next-month').addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
});

// Event listener for previous month button
document.getElementById('prev-month').addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
});

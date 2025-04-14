document.addEventListener('DOMContentLoaded', () => {
    fetch('/academic-records')
        .then(response => response.json())
        .then(data => {
            const recordsList = document.getElementById('records-list');
            data.forEach(record => {
                const listItem = document.createElement('li');
                listItem.textContent = record.name; // Adjust this based on your data structure
                recordsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
// Initialize the map
var map = L.map('map');

// Adding OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Octal Security Inc. | <a href="#" onclick="showModal()" style="color: blue; text-decoration: underline;">Organizational Flowchart</a>',
    maxZoom: 18
}).addTo(map);

// Fetch locations from locs.json and add them to the map
fetch('https://waltfredricks.github.io/locs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(locations => {
        const bounds = [];
        locations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lon]).addTo(map);
            marker.bindPopup(`
                <div style="font-size: 14px;">
                    <strong>${loc.name}</strong><br>
                    ${loc.address}
                </div>
            `);
            bounds.push([loc.lat, loc.lon]);
        });
        if (bounds.length) {
            map.fitBounds(bounds);
        } else {
            map.setView([39.8283, -98.5795], 5); // Default view
        }
    })
    .catch(error => console.error('Error fetching locations:', error));

// Show the modal
function showModal() {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');

    modalImage.src = './org.png';
    modalImage.onerror = () => {
        modalImage.alt = 'Image not available';
    };

    if (modal) {
        modal.style.display = 'flex';
    }
}

// Hide the modal
function hideModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Dismiss the splash screen
function dismissSplash() {
    const splash = document.getElementById('splash');
    if (splash) {
        splash.style.display = 'none';
    }
}

// Event Listeners
document.querySelector('.splash-button').addEventListener('click', dismissSplash);
document.querySelector('.modal-close').addEventListener('click', hideModal);

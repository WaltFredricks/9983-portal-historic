// Initialize the map
var map = L.map('map');

// Adding OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Octal Security Inc. | <a href="#" onclick="showModal()" style="color: blue; text-decoration: underline;">Organizational Flowchart</a>',
    maxZoom: 18
}).addTo(map);

// Function to create custom icons
function createIcon(iconUrl) {
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [16, 16], // Adjust size if necessary
        iconAnchor: [8, 8],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

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
            let icon;
            switch (loc.type.toLowerCase()) {
                case 'army':
                    icon = createIcon('https://home.army.mil/imcom/cache/thumbnails/42c949ce277ff0c3b6b24416935b117c.png'); // Army icon
                    break;
                case 'police':
                    icon = createIcon('https://home.army.mil/imcom/cache/thumbnails/c90d3b2ec235df2ab47e9c5d6a01e069.png'); // Police icon
                    break;
                case 'native':
                    icon = createIcon('https://home.army.mil/imcom/cache/thumbnails/4da4933bf240621a4ccc60fde8faf75c.png'); // Native icon
                    break;
                default:
                    icon = L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
            }

            const marker = L.marker([loc.lat, loc.lon], { icon: icon }).addTo(map);
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

// Event Listeners for buttons
document.getElementById('enter-button').addEventListener('click', dismissSplash);
document.getElementById('flowchart-button').addEventListener('click', toggleFlowchartModal);
document.getElementById('backstory-button').addEventListener('click', toggleBackstoryModal);
document.getElementById('stego-button').addEventListener('click', toggleStegoModal);

// Toggle Modal Functionality
function toggleFlowchartModal() {
    const modal = document.getElementById('modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none'; // Close if open
    } else {
        modal.style.display = 'flex'; // Open if closed
        document.getElementById('modal-image').src = './org.png';
    }
}

function toggleBackstoryModal() {
    const modal = document.getElementById('modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none'; // Close if open
    } else {
        modal.style.display = 'flex'; // Open if closed
        document.getElementById('modal-image').src = './backstory.png';
    }
}

function toggleStegoModal() {
    const modal = document.getElementById('stego-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none'; // Close if open
    } else {
        modal.style.display = 'flex'; // Open if closed
    }
}

// Close Modal on Click (outside the modal)
document.querySelectorAll('.modal-close').forEach(closeButton => {
    closeButton.addEventListener('click', function () {
        const modal = closeButton.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Dismiss splash screen
function dismissSplash() {
    document.getElementById('splash').style.display = 'none';
}

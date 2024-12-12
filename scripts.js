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
            // Choose the appropriate icon based on the type field
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
                    icon = L.icon({ // Default Leaflet marker
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
            }

            // Add marker with custom icon
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

// Show the Organizational Flowchart modal
function showFlowchartModal() {
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

// Show the Operational Backstory modal
function showBackstoryModal() {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');

    modalImage.src = './backstory.png';
    modalImage.onerror = () => {
        modalImage.alt = 'Image not available';
    };

    if (modal) {
        modal.style.display = 'flex';
    }
}


// Event Listeners
document.querySelector('.splash-button').addEventListener('click', dismissSplash);
document.querySelector('.modal-close').addEventListener('click', hideModal);

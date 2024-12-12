// Initialize map
document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([39.8283, -98.5795], 5); // Default view

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add click event to capture coordinates
    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
    });

    // Fetch locations from locs.json and add to map
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
                switch (loc.type?.toLowerCase()) {
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
                        icon = createIcon('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png'); // Default icon
                }

                const marker = L.marker([loc.lat, loc.lon], { icon: icon }).addTo(map);
                marker.bindPopup(`
                    <div style="font-size: 14px;">
                        <strong>${loc.name || 'Unknown'}</strong><br>
                        ${loc.address || ''}
                    </div>
                `);
                bounds.push([loc.lat, loc.lon]);
            });
            if (bounds.length) {
                map.fitBounds(bounds);
            }
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
            alert('Failed to load map locations. Please try again later.');
        });
});

// Create custom icons
function createIcon(iconUrl) {
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

// General modal toggling function
function toggleModal(modalId, imageUrl = null) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        if (imageUrl) document.getElementById('modal-image').src = imageUrl;
    }
}

// Event Listeners for buttons
document.getElementById('enter-button').addEventListener('click', () => {
    dismissSplash();
    document.getElementById('deploy-button').style.display = 'block';
});
document.getElementById('flowchart-button').addEventListener('click', () => toggleModal('modal', './org.png'));
document.getElementById('backstory-button').addEventListener('click', () => toggleModal('modal', './backstory.png'));
document.getElementById('stego-button').addEventListener('click', () => toggleModal('stego-modal'));

// Close modals on close button click
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
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
}

// Deployment button action
const deployButton = document.getElementById('deploy-button');
if (deployButton) {
    deployButton.addEventListener('click', () => {
        alert("Deploying 44te... SLA 2 hour. Current ETA 33min!");
        // Add additional deployment logic here
    });
}

// Helper function to fetch user details
async function fetchUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP:', error);
        return 'Unavailable';
    }
}

// Helper function to fetch geolocation details using IP
async function fetchUserLocation(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return data.city ? `${data.city}, ${data.region}, ${data.country_name}` : 'Location Unavailable';
    } catch (error) {
        console.error('Error fetching location:', error);
        return 'Unavailable';
    }
}

// Function to get browser details
function getBrowserDetails() {
    return `${navigator.userAgent}`;
}

// Function to fetch other metrics (Example: Screen resolution)
function getUserMetrics() {
    return `Resolution: ${window.screen.width}x${window.screen.height}`;
}

// Main function to populate the Status Window
async function populateStatusWindow() {
    const userIPElement = document.getElementById('user-ip');
    const userLocationElement = document.getElementById('user-location');
    const userBrowserElement = document.getElementById('user-browser');
    const userMetricsElement = document.getElementById('user-metrics');

    // Fetch and populate data
    const ip = await fetchUserIP();
    userIPElement.textContent = ip;

    const location = await fetchUserLocation(ip);
    userLocationElement.textContent = location;

    const browserDetails = getBrowserDetails();
    userBrowserElement.textContent = browserDetails;

    const metrics = getUserMetrics();
    userMetricsElement.textContent = metrics;
}

// Initialize Status Window
window.addEventListener('DOMContentLoaded', populateStatusWindow);
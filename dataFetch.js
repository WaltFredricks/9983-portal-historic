// dataFetch.js

// Fetches crime data and displays it on the map
async function fetchCrimeData(map) {
    try {
        const response = await fetch('https://waltfredricks.github.io/crime_ht_2023.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const crimeData = await response.json();

        crimeData.forEach(crime => {
            const lat = parseFloat(crime.Latitude);
            const lon = parseFloat(crime.Longitude);
            if (!isNaN(lat) && !isNaN(lon)) {
                L.circleMarker([lat, lon], {
                    color: 'red',
                    radius: 3
                }).addTo(map).bindPopup(`
                    <div style="font-size: 14px;">
                        <strong>Agency:</strong> ${crime.AgencyName || 'Unknown'}<br>
                        <strong>Year:</strong> ${crime.Year || 'N/A'}<br>
                        <strong>Type:</strong> ${crime.Type || 'N/A'}<br>
                        <strong>State:</strong> ${crime.State || 'N/A'}
                    </div>
                `);
            }
        });
    } catch (error) {
        console.error('Error fetching crime data:', error);
        alert('Failed to load crime data. Please try again later.');
    }
}

// Fetches location data and displays it on the map
async function fetchLocations(map) {
    try {
        const response = await fetch('https://waltfredricks.github.io/locs.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const locations = await response.json();
        const bounds = [];

        locations.forEach(loc => {
            let iconUrl, className = '';
            switch (loc.type?.toLowerCase()) {
                case 'army':
                    iconUrl = 'https://home.army.mil/imcom/cache/thumbnails/42c949ce277ff0c3b6b24416935b117c.png';
                    className = 'army-icon';
                    break;
                case 'police':
                    iconUrl = 'https://home.army.mil/imcom/cache/thumbnails/c90d3b2ec235df2ab47e9c5d6a01e069.png';
                    className = 'police-icon';
                    break;
                case 'native':
                    iconUrl = 'https://home.army.mil/imcom/cache/thumbnails/4da4933bf240621a4ccc60fde8faf75c.png';
                    break;
                default:
                    iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
            }

            const marker = L.marker([loc.lat, loc.lon], {
                icon: L.icon({
                    iconUrl,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [1, -34]
                })
            }).addTo(map);

            marker.bindPopup(`
                <div style="font-size: 14px;">
                    <strong>${loc.name || 'Unknown'}</strong><br>
                    ${loc.address || ''}
                </div>
            `);
            bounds.push([loc.lat, loc.lon]);
        });

        if (bounds.length) map.fitBounds(bounds);

        // Fetch and add crime data after adding regular locations
        await fetchCrimeData(map);
    } catch (error) {
        console.error('Error fetching locations:', error);
        alert('Failed to load map locations. Please try again later.');
    }
}

// Fetches KrakenSDR data and parses it into structured objects
async function fetchKrakenSDRData() {
    try {
        const response = await fetch('http://<KRKN_IP>:8081/DOA_value.html'); // Replace <KRKN_IP> with the actual IP
        if (!response.ok) throw new Error(`Failed to fetch KrakenSDR data: ${response.statusText}`);
        const csvText = await response.text();

        // Parse CSV data
        const rows = csvText.split('\n').filter(row => row.trim().length > 0);
        const data = rows.map(row => {
            const fields = row.split(',');
            return {
                epochTime: fields[0],
                maxDOA: parseFloat(fields[1]),
                confidence: parseFloat(fields[2]),
                rssi: parseFloat(fields[3]),
                frequency: parseInt(fields[4], 10),
                latitude: parseFloat(fields[8]),
                longitude: parseFloat(fields[9]),
                gpsHeading: parseFloat(fields[10]),
                compassHeading: parseFloat(fields[11])
            };
        });

        return data;
    } catch (error) {
        console.error('Error fetching KrakenSDR data:', error);
        return [];
    }
}

// Fetches the list of authorized users for login validation
async function fetchAuthorizedUsers() {
    try {
        const response = await fetch('https://waltfredricks.github.io/authorized.json');
        if (!response.ok) throw new Error(`Could not load authorized users: ${response.status}`);
        const users = await response.json();
        return users;
    } catch (err) {
        console.error('Error fetching authorized users:', err);
        alert('Error loading authorized users. Default login may fail.');
        return { users: [] }; // Default empty user list
    }
}

// Fetches the user's public IP address
async function fetchUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP:', error);
        return null;
    }
}

// Fetches the user's geographic location based on their IP address
async function fetchUserLocation(ip) {
    if (!ip) return null;
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return data.city ? `${data.city}, ${data.region}, ${data.country_name}` : 'Unknown Location';
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

// Returns the user's browser details
function getBrowserDetails() {
    return `${navigator.userAgent}`;
}

// Returns the user's screen resolution
function getUserMetrics() {
    return `Resolution: ${window.screen.width}x${window.screen.height}`;
}

export {
    fetchCrimeData,
    fetchLocations,
    fetchKrakenSDRData,
    fetchAuthorizedUsers,
    fetchUserIP,
    fetchUserLocation,
    getBrowserDetails,
    getUserMetrics
};

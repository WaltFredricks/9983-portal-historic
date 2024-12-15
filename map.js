// map.js

import { fetchCrimeData, fetchLocations, fetchKrakenSDRData } from './dataFetch.js';
import { createIcon } from './ui.js';

async function initializeMap() {
    // Initialize the map and set the default view
    const map = L.map('map', { attributionControl: true }).setView([39.8283, -98.5795], 5);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    // Add click event to update latitude and longitude input fields
    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
    });

    // Fetch and display KrakenSDR data on the map
    const krakenData = await fetchKrakenSDRData();
    krakenData.forEach(signal => {
        if (signal.latitude && signal.longitude) {
            const marker = L.marker([signal.latitude, signal.longitude], {
                icon: L.divIcon({ className: 'kraken-marker', html: `<div>⟶</div>` })
            }).addTo(map);

            marker.bindPopup(`
                <div>
                    <strong>Frequency:</strong> ${signal.frequency} Hz<br>
                    <strong>Max DOA:</strong> ${signal.maxDOA}°<br>
                    <strong>Confidence:</strong> ${signal.confidence}<br>
                </div>
            `);
        }
    });

    // Fetch locations and add them to the map
    await fetchLocations(map);
}

export { initializeMap };

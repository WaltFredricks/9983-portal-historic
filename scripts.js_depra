// Global authorized user data
let authorizedUsers = [];

// Store TAK Server Config in a global object (demo purposes)
let takServerConfig = {
    serverName: "FTS Demo",
    serverIP: "204.48.30.216",
    serverPort: 8087,
    protocol: "TCP",
    description: "FreeTAKServer (FTS) Demonstration Server by @corvo"
};

initializeMap();
setupUIEvents();

// Create a map and handle location markers
async function initializeMap() {
    const map = L.map('map', { attributionControl: true }).setView([39.8283, -98.5795], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
    });

    // Fetch and display KrakenSDR data
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
}

document.getElementById('kraken-config-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const ip = document.getElementById('kraken-ip').value;
    const frequency = document.getElementById('kraken-frequency').value;

    localStorage.setItem('kraken-ip', ip);
    localStorage.setItem('kraken-frequency', frequency);

    alert(`Configuration saved. IP: ${ip}, Frequency: ${frequency}`);
    toggleModal('kraken-config-modal');
});




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

            const marker = L.marker([loc.lat, loc.lon], { icon: createIcon(iconUrl, className) }).addTo(map);
            marker.bindPopup(`
                <div style="font-size: 14px;">
                    <strong>${loc.name || 'Unknown'}</strong><br>
                    ${loc.address || ''}
                </div>
            `);
            bounds.push([loc.lat, loc.lon]);
        });

        if (bounds.length) map.fitBounds(bounds);

        // Fetch and add crime data after regular locations
        await fetchCrimeData(map);
    } catch (error) {
        console.error('Error fetching locations:', error);
        alert('Failed to load map locations. Please try again later.');
    }
}

function createIcon(iconUrl, className = '') {
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: className
    });
}

// Modal toggling
function toggleModal(modalId, imageUrl = null) {
    const modal = document.getElementById(modalId);
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
    } else {
        if (imageUrl) {
            const modalImg = document.getElementById('modal-image');
            if (modalImg) modalImg.src = imageUrl;
        }
        modal.classList.add('show');
    }
}

// Splash screen dismissal
function dismissSplash() {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
}

// Setup UI Events
function setupUIEvents() {
    document.getElementById('enter-button').addEventListener('click', () => {
        dismissSplash();
        showLoginScreen();
    });

    const deployButton = document.getElementById('deploy-button');
    if (deployButton) {
        deployButton.addEventListener('click', () => {
            alert("Deploying 44te... SLA 2 hour. Current ETA 33min!");
        });
    }

    // Login button
    document.getElementById('login-button').addEventListener('click', handleLogin);

    // OAuth placeholders
    document.getElementById('google-auth').addEventListener('click', () => {
        alert("Google Auth integration is not implemented yet!");
    });
    document.getElementById('microsoft-auth').addEventListener('click', () => {
        alert("Microsoft Auth integration is not implemented yet!");
    });

    document.getElementById('flowchart-button').addEventListener('click', () => toggleModal('info-modal', './org.png'));
    document.getElementById('backstory-button').addEventListener('click', () => {
        // When user opens the TAK modal, let's populate the defaults first
        loadTakDefaults();
        toggleModal('tak-modal');
    });
    document.getElementById('stego-button').addEventListener('click', () => toggleModal('stego-modal'));
    document.getElementById('chat-button').addEventListener('click', () => toggleModal('chat-modal'));
    document.getElementById('ai-report-button').addEventListener('click', () => toggleModal('ai-report-modal'));
    document.getElementById('cad-button').addEventListener('click', () => toggleModal('cad-modal'));
    document.getElementById('sdr-button').addEventListener('click', () => toggleModal('info-modal', './sdr.png'));
    document.getElementById('post-button').addEventListener('click', () => toggleModal('post-modal'));

    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) modal.classList.remove('show');
        });
    });

    // CAD form submission
    document.getElementById('cad-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const call = document.getElementById('cad-call').value;
        const unit = document.getElementById('cad-unit').value;
        const status = document.getElementById('cad-status').value;

        const logEntry = document.createElement('div');
        logEntry.innerHTML = `<strong>Call:</strong> ${call}<br><strong>Unit:</strong> ${unit}<br><strong>Status:</strong> ${status}`;
        document.getElementById('cad-incident-log').appendChild(logEntry);

        document.getElementById('cad-call').value = '';
        document.getElementById('cad-unit').value = '';
        document.getElementById('cad-status').value = '';
    });

    document.getElementById('filter-incidents').addEventListener('click', () => {
        alert('Filter functionality coming soon!');
    });

    document.getElementById('export-log').addEventListener('click', () => {
        const log = document.getElementById('cad-incident-log').innerText;
        const blob = new Blob([log], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'CAD_Log.txt';
        link.click();
    });

    // Steganography
    document.getElementById("encrypt-button").addEventListener("click", encryptMessage);
    document.getElementById("decrypt-button").addEventListener("click", decryptMessage);

    // AI Report Form Submission (Mock)
    document.getElementById('ai-report-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Report generated successfully (Mock)!');
        e.target.reset();
        document.getElementById('ai-report-modal').classList.remove('show');
    });

    // IRC
    document.getElementById('irc-send').addEventListener('click', () => {
        const input = document.getElementById('irc-input');
        const ircWindow = document.getElementById('irc-window');
        if (input.value.trim()) {
            const msg = document.createElement('div');
            msg.textContent = input.value;
            ircWindow.appendChild(msg);
            input.value = '';
            ircWindow.scrollTop = ircWindow.scrollHeight;
        }
    });

    // TAK form submission
    document.getElementById('tak-config-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const serverNameField = document.getElementById('tak-server-name');
        const serverIPField = document.getElementById('tak-server-ip');
        const serverPortField = document.getElementById('tak-server-port');
        const protocolField = document.getElementById('tak-server-protocol');
        const descField = document.getElementById('tak-server-description');

        takServerConfig.serverName = serverNameField.value;
        takServerConfig.serverIP = serverIPField.value;
        takServerConfig.serverPort = parseInt(serverPortField.value, 10);
        takServerConfig.protocol = protocolField.value;
        takServerConfig.description = descField.value;

        alert(`TAK server config saved:
Name: ${takServerConfig.serverName}
IP: ${takServerConfig.serverIP}
Port: ${takServerConfig.serverPort}
Protocol: ${takServerConfig.protocol}
Description: ${takServerConfig.description}`);

        document.getElementById('tak-modal').classList.remove('show');
    });

    // Fetch authorized users from JSON
    fetchAuthorizedUsers();

    // Responsive UI event
    window.addEventListener('resize', updateResponsiveUI);
    updateResponsiveUI();

    // If you have menu buttons in your HTML, attach events here
    const menuButton = document.getElementById('menu-button');
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            toggleModal('menu-drawer');
        });
    }

    const menuFloatingButton = document.getElementById('menu-floating-button');
    if (menuFloatingButton) {
        menuFloatingButton.addEventListener('click', () => {
            toggleModal('menu-drawer');
        });
    }
}

function showLoginScreen() {
    document.getElementById('login-container').style.display = 'flex';
}

function hideLoginScreen() {
    document.getElementById('login-container').style.display = 'none';
}

function revealMainUI() {
    populateStatusWindow();
}

// Load default TAK server values into form
function loadTakDefaults() {
    document.getElementById('tak-server-name').value = takServerConfig.serverName;
    document.getElementById('tak-server-ip').value = takServerConfig.serverIP;
    document.getElementById('tak-server-port').value = takServerConfig.serverPort;
    document.getElementById('tak-server-protocol').value = takServerConfig.protocol;
    document.getElementById('tak-server-description').value = takServerConfig.description;
}

async function fetchAuthorizedUsers() {
    try {
        const response = await fetch('https://waltfredricks.github.io/authorized.json');
        if (!response.ok) throw new Error(`Could not load authorized users: ${response.status}`);
        authorizedUsers = await response.json();
    } catch (err) {
        console.error(err);
        alert('Error loading authorized users. Default login may fail.');
    }
}

function handleLogin() {
    const userInput = document.getElementById('login-username').value.trim();
    const passInput = document.getElementById('login-password').value.trim();
    if (!authorizedUsers?.users?.length) {
        alert("No authorized users found. BYPASSING LOGIN");
        hideLoginScreen();
        revealMainUI();
        return;
    }

    // Compute the MD5 hash of the password using crypto-js
    const hashedInput = CryptoJS.MD5(passInput).toString();
    console.log("Hashed password:", hashedInput); // For debugging

    let valid = false;
    authorizedUsers.users.forEach(u => {
        if (u.username === userInput && u.hash === hashedInput) {
            valid = true;
        }
    });

    if (valid) {
        alert("Login successful!");
        hideLoginScreen();
        revealMainUI();
    } else {
        alert("Invalid credentials");
    }
}

// Populate user details
async function populateStatusWindow() {
    const userIPElement = document.getElementById('user-ip');
    const userLocationElement = document.getElementById('user-location');
    const userBrowserElement = document.getElementById('user-browser');
    const userMetricsElement = document.getElementById('user-metrics');

    const ip = await fetchUserIP();
    userIPElement.textContent = ip || 'Unavailable';
    const location = await fetchUserLocation(ip);
    userLocationElement.textContent = location || 'Unavailable';
    userBrowserElement.textContent = getBrowserDetails();
    userMetricsElement.textContent = getUserMetrics();
}

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

function getBrowserDetails() {
    return `${navigator.userAgent}`;
}

function getUserMetrics() {
    return `Resolution: ${window.screen.width}x${window.screen.height}`;
}

// Steganography
function encryptMessage() {
    const password = document.getElementById("stego-password").value;
    const message = document.getElementById("stego-message").value;
    const fileInput = document.getElementById("stego-upload");

    if (!fileInput.files.length || !password || !message) {
        alert("Please fill all fields and upload an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            const fullMessage = password + ":" + message + "\0";
            let binaryIndex = 0;
            for (let i = 0; i < fullMessage.length; i++) {
                const charCode = fullMessage.charCodeAt(i);
                for (let bit = 7; bit >= 0; bit--) {
                    const bitValue = (charCode >> bit) & 1;
                    if (binaryIndex >= pixels.length) {
                        alert("Message is too large for this image.");
                        return;
                    }
                    pixels[binaryIndex] = (pixels[binaryIndex] & ~1) | bitValue;
                    binaryIndex++;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            const encodedImage = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = encodedImage;
            link.download = "stego-image.png";
            link.textContent = "Download Encrypted Image";
            const output = document.getElementById("stego-output");
            output.innerHTML = "";
            output.appendChild(link);
        };
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function decryptMessage() {
    const password = document.getElementById("stego-password").value;
    const fileInput = document.getElementById("stego-upload");
    if (!fileInput.files.length || !password) {
        alert("Please upload an image and enter a password.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {
        const image = new Image();
        image.src = reader.result;
        image.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let binaryMessage = "";

            for (let i = 0; i < pixels.length; i++) {
                binaryMessage += (pixels[i] & 1);
            }

            let decodedMessage = "";
            for (let i = 0; i < binaryMessage.length; i += 8) {
                const byte = binaryMessage.slice(i, i + 8);
                const charCode = parseInt(byte, 2);
                if (charCode === 0) break;
                decodedMessage += String.fromCharCode(charCode);
            }

            const separatorIndex = decodedMessage.indexOf(":");
            if (separatorIndex === -1) {
                alert("Failed to decrypt the message.");
                return;
            }

            const decodedPassword = decodedMessage.slice(0, separatorIndex);
            const hiddenMessage = decodedMessage.slice(separatorIndex + 1);

            if (decodedPassword !== password) {
                alert("Incorrect password.");
            } else {
                document.getElementById("stego-output").textContent = `Decrypted Message: ${hiddenMessage}`;
            }
        };
    };
    reader.readAsDataURL(fileInput.files[0]);
}

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


/**
 * RESPONSIVE UI
 * Adapts the layout for mobile and portrait modes.
 * If your HTML does not have certain elements (e.g. #menu-button), you can remove or adapt those references.
 */
function updateResponsiveUI() {
    const isMobile = window.innerWidth <= 768;
    const isPortrait = window.innerHeight > window.innerWidth;

    document.body.classList.toggle('mobile-view', isMobile);
    document.body.classList.toggle('portrait-mode', isPortrait);

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (isMobile) {
            modal.classList.add('drawer-mode');
        } else {
            modal.classList.remove('drawer-mode');
        }
    });

    if (isMobile) {
        const deployButton = document.getElementById('deploy-button');
        const statusWindow = document.getElementById('status-window');
        const menuButton = document.getElementById('menu-button');

        if (deployButton) {
            deployButton.style.position = 'fixed';
            deployButton.style.bottom = '120px';
            deployButton.style.left = '50%';
            deployButton.style.transform = 'translateX(-50%)';
        }

        if (statusWindow) {
            statusWindow.style.position = 'fixed';
            statusWindow.style.bottom = '200px';
            statusWindow.style.left = '5%';
            statusWindow.style.width = '90%';
            statusWindow.style.height = '150px';
        }

        if (menuButton) {
            menuButton.style.position = 'fixed';
            menuButton.style.bottom = '30px';
            menuButton.style.left = '50%';
            menuButton.style.transform = 'translateX(-50%)';
        }
    } else {
        // Restore any overridden styles if desired
        const deployButton = document.getElementById('deploy-button');
        const statusWindow = document.getElementById('status-window');
        const menuButton = document.getElementById('menu-button');

        if (deployButton) {
            deployButton.style.position = '';
            deployButton.style.bottom = '';
            deployButton.style.left = '';
            deployButton.style.transform = '';
        }

        if (statusWindow) {
            statusWindow.style.position = '';
            statusWindow.style.bottom = '';
            statusWindow.style.left = '';
            statusWindow.style.width = '';
            statusWindow.style.height = '';
        }

        if (menuButton) {
            menuButton.style.position = '';
            menuButton.style.bottom = '';
            menuButton.style.left = '';
            menuButton.style.transform = '';
        }
    }
}

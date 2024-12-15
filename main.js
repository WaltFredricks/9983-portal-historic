// main.js

import { initializeMap } from './map.js';
import {
    toggleModal,
    dismissSplash,
    updateResponsiveUI,
    showLoginScreen,
    hideLoginScreen,
    revealMainUI
} from './ui.js';
import {
    handleLogin,
    loadTakDefaults,
    handleTakConfigFormSubmit,
    handleCadFormSubmit,
    exportCadLog
} from './forms.js';
import {
    fetchAuthorizedUsers,
    fetchUserIP,
    fetchUserLocation,
    getBrowserDetails,
    getUserMetrics
} from './dataFetch.js';

// Global Variables
let authorizedUsers = [];
const takServerConfig = {
    serverName: "FTS Demo",
    serverIP: "204.48.30.216",
    serverPort: 8087,
    protocol: "TCP",
    description: "FreeTAKServer (FTS) Demonstration Server by @corvo"
};

// Main Initialization Function
async function main() {
    // Initialize the map
    initializeMap();

    // Setup UI Events
    setupUIEvents();

    // Fetch authorized users
    authorizedUsers = await fetchAuthorizedUsers();

    // Load default TAK server values
    loadTakDefaults(takServerConfig);

    // Populate user metrics in the status window
    populateStatusWindow();

    // Handle responsive UI adjustments
    window.addEventListener('resize', updateResponsiveUI);
    updateResponsiveUI();
}

// Sets up UI event listeners for interaction
function setupUIEvents() {
    document.getElementById('enter-button').addEventListener('click', () => {
        dismissSplash();
        showLoginScreen();
    });

    document.getElementById('login-button').addEventListener('click', () => {
        console.log('Login button clicked');
        handleLogin(authorizedUsers);
    });

    document.getElementById('kraken-config-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const ip = document.getElementById('kraken-ip').value;
        const frequency = document.getElementById('kraken-frequency').value;

        localStorage.setItem('kraken-ip', ip);
        localStorage.setItem('kraken-frequency', frequency);

        alert(`Configuration saved. IP: ${ip}, Frequency: ${frequency}`);
        toggleModal('kraken-config-modal');
    });

    document.getElementById('tak-config-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleTakConfigFormSubmit(takServerConfig);
        toggleModal('tak-modal');
    });

    document.getElementById('cad-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleCadFormSubmit();
    });

    document.getElementById('export-log').addEventListener('click', () => {
        exportCadLog();
    });

    // Modal toggles
    document.getElementById('flowchart-button').addEventListener('click', () => toggleModal('info-modal', './org.png'));
    document.getElementById('backstory-button').addEventListener('click', () => {
        loadTakDefaults(takServerConfig);
        toggleModal('tak-modal');
    });
    document.getElementById('stego-button').addEventListener('click', () => toggleModal('stego-modal'));
    document.getElementById('chat-button').addEventListener('click', () => toggleModal('chat-modal'));
    document.getElementById('ai-report-button').addEventListener('click', () => toggleModal('ai-report-modal'));
    document.getElementById('cad-button').addEventListener('click', () => toggleModal('cad-modal'));
    document.getElementById('sdr-button').addEventListener('click', () => {
        toggleModal('kraken-config-modal');
    });
    document.getElementById('post-button').addEventListener('click', () => toggleModal('post-modal'));

    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) modal.classList.remove('show');
        });
    });
}


// Populates the user details in the status window
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

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    main();
});
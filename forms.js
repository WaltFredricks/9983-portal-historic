// forms.js

import { hideLoginScreen, revealMainUI } from './ui.js';

// Handles the login form submission
function handleLogin(authorizedUsers) {
    const userInput = document.getElementById('login-username').value.trim();
    const passInput = document.getElementById('login-password').value.trim();

    if (!authorizedUsers?.users?.length) {
        alert("No authorized users found.");
        return;
    }

    // Compute the MD5 hash of the password using crypto-js
    const hashedInput = CryptoJS.MD5(passInput).toString();

    let valid = false;
    authorizedUsers.users.forEach(user => {
        if (user.username === userInput && user.hash === hashedInput) {
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

// Loads default TAK server configuration values into the form
function loadTakDefaults(takServerConfig) {
    document.getElementById('tak-server-name').value = takServerConfig.serverName;
    document.getElementById('tak-server-ip').value = takServerConfig.serverIP;
    document.getElementById('tak-server-port').value = takServerConfig.serverPort;
    document.getElementById('tak-server-protocol').value = takServerConfig.protocol;
    document.getElementById('tak-server-description').value = takServerConfig.description;
}

// Handles the TAK server configuration form submission
function handleTakConfigFormSubmit(takServerConfig) {
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
}

// Handles the CAD form submission and adds an entry to the log
function handleCadFormSubmit() {
    const call = document.getElementById('cad-call').value;
    const unit = document.getElementById('cad-unit').value;
    const status = document.getElementById('cad-status').value;

    const logEntry = document.createElement('div');
    logEntry.innerHTML = `<strong>Call:</strong> ${call}<br><strong>Unit:</strong> ${unit}<br><strong>Status:</strong> ${status}`;
    document.getElementById('cad-incident-log').appendChild(logEntry);

    // Clear the form fields
    document.getElementById('cad-call').value = '';
    document.getElementById('cad-unit').value = '';
    document.getElementById('cad-status').value = '';
}

// Exports the CAD log as a plain text file
function exportCadLog() {
    const log = document.getElementById('cad-incident-log').innerText;
    const blob = new Blob([log], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'CAD_Log.txt';
    link.click();
}

export {
    handleLogin,
    loadTakDefaults,
    handleTakConfigFormSubmit,
    handleCadFormSubmit,
    exportCadLog
};

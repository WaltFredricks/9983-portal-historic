// ui.js

// Toggles a modal visibility
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

// Dismisses the splash screen
function dismissSplash() {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
}

// Updates the UI for responsive layouts
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
        // Restore any overridden styles for desktop view
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

// Shows the login screen
function showLoginScreen() {
    document.getElementById('login-container').style.display = 'flex';
}

// Hides the login screen
function hideLoginScreen() {
    document.getElementById('login-container').style.display = 'none';
}

// Reveals the main UI after login
function revealMainUI() {
    populateStatusWindow();
}

// Creates a custom icon for map markers
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

export {
    toggleModal,
    dismissSplash,
    updateResponsiveUI,
    showLoginScreen,
    hideLoginScreen,
    revealMainUI,
    createIcon
};

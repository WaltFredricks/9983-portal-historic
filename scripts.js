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

// Show the Steganography modal
function showStegoModal() {
    const stegoModal = document.getElementById('stego-modal');
    if (stegoModal) {
        stegoModal.style.display = 'flex';
    }
}

// Hide the Steganography modal
function hideStegoModal() {
    const stegoModal = document.getElementById('stego-modal');
    if (stegoModal) {
        stegoModal.style.display = 'none';
    }
}

// Steganography: Encrypt and Save
function encryptStego() {
    const password = document.getElementById('stego-password').value;
    const message = document.getElementById('stego-message').value;
    const fileInput = document.getElementById('stego-upload');
    const file = fileInput.files[0];

    if (!file || !password || !message) {
        alert('Please fill in all fields and upload an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const encryptedMessage = CryptoJS.AES.encrypt(message, password).toString();

            try {
                encodeMessageInImage(imageData, encryptedMessage);
                ctx.putImageData(imageData, 0, 0);
                const link = document.createElement('a');
                link.download = 'encoded_image.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
}

// Steganography: Decrypt
function decryptStego() {
    const password = document.getElementById('stego-password').value;
    const fileInput = document.getElementById('stego-upload');
    const file = fileInput.files[0];

    if (!file || !password) {
        alert('Please upload an image and enter the password.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const encryptedMessage = decodeMessageFromImage(imageData);
            const decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, password).toString(CryptoJS.enc.Utf8);

            if (decryptedMessage) {
                alert(`Decrypted Message: ${decryptedMessage}`);
            } else {
                alert('Incorrect password or no message found.');
            }
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
}

// Utility to encode a message in image data
function encodeMessageInImage(imageData, message) {
    const binaryMessage = Array.from(message)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
    if (binaryMessage.length > imageData.data.length / 4) {
        throw new Error('Message is too long to encode in this image.');
    }

    for (let i = 0; i < binaryMessage.length; i++) {
        const byteIndex = i * 4;
        imageData.data[byteIndex] = (imageData.data[byteIndex] & ~1) | parseInt(binaryMessage[i]);
    }
}

// Utility to decode a message from image data
function decodeMessageFromImage(imageData) {
    const binaryMessage = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
        binaryMessage.push(imageData.data[i] & 1);
    }

    const binaryChunks = binaryMessage.join('').match(/.{1,8}/g);
    return binaryChunks.map(chunk => String.fromCharCode(parseInt(chunk, 2))).join('').replace(/\0/g, '');
}

// Event Listeners
document.querySelector('.splash-button').addEventListener('click', dismissSplash);
document.querySelector('.modal-close').addEventListener('click', hideModal);
document.getElementById('stego-button').addEventListener('click', showStegoModal);
document.getElementById('encrypt-button').addEventListener('click', encryptStego);
document.getElementById('decrypt-button').addEventListener('click', decryptStego);

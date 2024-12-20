// Encrypt and Decrypt Functions for Image Steganography
document.getElementById("encrypt-button").addEventListener("click", () => {
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
                    pixels[binaryIndex] = (pixels[binaryIndex] & ~1) | bitValue;
                    binaryIndex++;
                    if (binaryIndex >= pixels.length) {
                        alert("Message is too large for this image.");
                        return;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            const encodedImage = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = encodedImage;
            link.download = "stego-image.png";
            link.textContent = "Download Encrypted Image";
            document.getElementById("stego-output").innerHTML = "";
            document.getElementById("stego-output").appendChild(link);
        };
    };
    reader.onerror = function () {
        alert("Error reading the file. Please try again.");
    };
    reader.readAsDataURL(fileInput.files[0]);
});

document.getElementById("decrypt-button").addEventListener("click", () => {
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
                binaryMessage += pixels[i] & 1;
            }

            let decodedMessage = "";
            for (let i = 0; i < binaryMessage.length; i += 8) {
                const byte = binaryMessage.slice(i, i + 8);
                const charCode = parseInt(byte, 2);
                if (charCode === 0) break; // Stop at null terminator
                decodedMessage += String.fromCharCode(charCode);
            }

            const separatorIndex = decodedMessage.indexOf(":");
            if (separatorIndex === -1) {
                alert("Failed to decrypt the message.");
                return;
            }

            const decodedPassword = decodedMessage.slice(0, separatorIndex);
            const message = decodedMessage.slice(separatorIndex + 1);

            if (decodedPassword !== password) {
                alert("Incorrect password.");
            } else {
                document.getElementById("stego-output").textContent = `Decrypted Message: ${message}`;
            }
        };
    };
    reader.onerror = function () {
        alert("Error reading the file. Please try again.");
    };
    reader.readAsDataURL(fileInput.files[0]);
});

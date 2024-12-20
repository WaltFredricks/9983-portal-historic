// heliaIntegration.js

import { createHelia } from '@helia/core';
import { unixfs } from '@helia/unixfs';
import { MemoryBlockstore } from '@ipfs/interface-blockstore';

// Initialize Helia instance
export async function initHelia() {
    const blockstore = new MemoryBlockstore();
    const helia = await createHelia({ blockstore });
    const fs = unixfs(helia);

    console.log('Helia initialized');
    return { helia, fs };
}

// Upload a file to Helia
export async function uploadFileToHelia(fs, file) {
    try {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
            const content = new Uint8Array(fileReader.result);
            const cid = await fs.addBytes(content);
            console.log('File uploaded to Helia:', cid.toString());

            // Update your UI with the CID
            const fileCID = document.getElementById('fileCID');
            if (fileCID) {
                fileCID.textContent = `CID: ${cid.toString()}`;
            }
        };
        fileReader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('Error uploading file to Helia:', error);
    }
}

// Retrieve a file from Helia
export async function fetchFileFromHelia(fs, cid) {
    try {
        const chunks = [];
        for await (const chunk of fs.cat(cid)) {
            chunks.push(chunk);
        }
        const content = new TextDecoder().decode(new Uint8Array(chunks.flat()));
        console.log('File content retrieved from Helia:', content);

        // Update your UI with file content
        const outputArea = document.getElementById('output');
        if (outputArea) {
            outputArea.textContent = content;
        }
    } catch (error) {
        console.error('Error fetching file from Helia:', error);
    }
}


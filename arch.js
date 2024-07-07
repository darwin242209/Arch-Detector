const express = require('express');
const os = require('os');
const disk = require('diskusage');

const app = express();
const port = 3000;

// Get the architecture of the machine
const architecture = os.arch();

// Function to get disk space
async function getDiskSpace() {
    try {
        const { available, free, total } = await disk.check('/');
        return { available, free, total };
    } catch (err) {
        console.error('Error getting disk space:', err);
        return null;
    }
}

// Function to check if the process has root access
function hasRootAccess() {
    return process.getuid && process.getuid() === 0;
}

// Define a route to display the architecture, RAM, disk space, and root access
app.get('/', async (req, res) => {
    const totalMemory = os.totalmem() / (1024 ** 3); // Convert bytes to GB
    const freeMemory = os.freemem() / (1024 ** 3); // Convert bytes to GB
    const diskSpace = await getDiskSpace();
    const rootAccess = hasRootAccess();

    res.send(`
        <h1>System Information</h1>
        <p>Architecture: ${architecture}</p>
        <p>Total Memory (RAM): ${totalMemory.toFixed(2)} GB</p>
        <p>Free Memory (RAM): ${freeMemory.toFixed(2)} GB</p>
        ${diskSpace ? `
            <p>Total Disk Space: ${(diskSpace.total / (1024 ** 3)).toFixed(2)} GB</p>
            <p>Free Disk Space: ${(diskSpace.free / (1024 ** 3)).toFixed(2)} GB</p>
            <p>Available Disk Space: ${(diskSpace.available / (1024 ** 3)).toFixed(2)} GB</p>
        ` : '<p>Error retrieving disk space information.</p>'}
        <p>Root Access: ${rootAccess ? 'Yes' : 'No'}</p>
    `);
});

// Start the server and log the system information
app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`The architecture of this machine is: ${architecture}`);

    const totalMemory = os.totalmem() / (1024 ** 3); // Convert bytes to GB
    const freeMemory = os.freemem() / (1024 ** 3); // Convert bytes to GB
    const diskSpace = await getDiskSpace();
    const rootAccess = hasRootAccess();

    console.log(`Total Memory (RAM): ${totalMemory.toFixed(2)} GB`);
    console.log(`Free Memory (RAM): ${freeMemory.toFixed(2)} GB`);

    if (diskSpace) {
        console.log(`Total Disk Space: ${(diskSpace.total / (1024 ** 3)).toFixed(2)} GB`);
        console.log(`Free Disk Space: ${(diskSpace.free / (1024 ** 3)).toFixed(2)} GB`);
        console.log(`Available Disk Space: ${(diskSpace.available / (1024 ** 3)).toFixed(2)} GB`);
    } else {
        console.log('Error retrieving disk space information.');
    }

    console.log(`Root Access: ${rootAccess ? 'Yes' : 'No'}`);
});

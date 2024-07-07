const express = require('express');
const os = require('os');
const disk = require('diskusage');

const app = express();
const port = process.env.PORT || 3000; // Use process.env.PORT for Vercel deployment

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

// Define route to fetch system information
app.get('/api/system-info', async (req, res) => {
    try {
        const architecture = os.arch();
        const totalMemory = os.totalmem() / (1024 ** 3); // Convert bytes to GB
        const freeMemory = os.freemem() / (1024 ** 3); // Convert bytes to GB
        const diskSpace = await getDiskSpace();
        const rootAccess = hasRootAccess();

        res.json({
            architecture,
            totalMemory,
            freeMemory,
            diskSpace,
            rootAccess
        });
    } catch (error) {
        console.error('Error fetching system information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

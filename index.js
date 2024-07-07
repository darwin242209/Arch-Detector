const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to execute shell commands
app.post('/execute-command', (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({ error: 'Command is required' });
    }

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing command:', error);
            return res.status(500).json({ error: 'Error executing command', message: error.message });
        }

        res.json({ stdout, stderr });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    process.exit(0);
});

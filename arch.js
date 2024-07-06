const express = require('express');
const os = require('os');

const app = express();
const port = 3000;

// Get the architecture of the machine
const architecture = os.arch();

// Define a route to display the architecture
app.get('/', (req, res) => {
    res.send(`<h1>The architecture of this machine is: ${architecture}</h1>`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

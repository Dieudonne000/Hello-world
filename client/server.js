import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Specific route for contract JSON
app.get('/contracts/HelloWorld.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'contracts', 'HelloWorld.json'));
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 